import { startTimers, resetQuestionTimer, SHORT_PLAY_DURATION, LONG_PLAY_DURATION } from './timer.js'; // Import required functions from timer.js
import { updateNextQuestionUI, enableChoices, toggleButton } from './ui.js'; // Import UI functions
import { shuffleArray } from './utils.js';
import { endGame, submitAnswer } from './answerHandling.js'; // Import answer handling functions

let quizQuestions = [];
let currentQuestionIndex = 0;
let isQuestionAnswered = false;
export let currentTrack;
let currentChoiceHandlers = [];
let selectedTrackName = '';
let songPlayTimeout;
let quizType;
let navigationListenerAdded = false;
let selectedIndex = -1;

export async function initQuestions() {
    const success = await fetchQuizQuestions();
    if (success) {
        quizType = localStorage.getItem('quizType') || 'multiple-choice';
        showNextQuestion();
    }
}

// Fetch quiz data from the server and shuffle the tracks
async function fetchQuizQuestions() {
    const timePeriod = localStorage.getItem('timePeriod') || 'medium_term'; // Default to medium_term if not set
    try {
        const response = await fetch(`/api/quiz-data?time_range=${timePeriod}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
            console.error("Error fetching quiz questions:", data);
            window.location.href = '/logout';
            return false;
        }
        quizQuestions = shuffleArray(data.top_tracks);
        return true;
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        window.location.href = '/logout';
        return false;
    }
}

function showNextQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        endGame();
        return;
    }

    setQuestionAnswered(false);

    currentTrack = quizQuestions[currentQuestionIndex];
    // console.log("Showing question for track:", currentTrack['name']);
    // console.log(`Quiz type: ${quizType}`);

    const choicesContainer = document.querySelector('.choices-container');
    const textInputContainer = document.querySelector('.text-input-container');

    // Update the question display based on the quiz type
    if (quizType === 'multiple-choice') {
        choicesContainer.classList.add('show');
        textInputContainer.classList.add('hidden');
        updateChoices();
    } else {
        choicesContainer.classList.add('hidden');
        textInputContainer.classList.add('show');
        updateTextInput();
        selectedTrackName = ''; // Reset the stored track name
    }

    updateNextQuestionUI(currentQuestionIndex);
    resetQuestionTimer(); 

    toggleButton('next-button', false); // Disable the next button until the question is answered
    toggleButton('play-button', true); // Enable the play button for the new question
    toggleButton('stop-button', false); // Disable the stop button for the new question
    toggleButton('submit-button', false); // Disable the submit button for the new question
}

function updateChoices() {
    const options = generateOptions(currentTrack);
    const choicesElement = document.getElementById('choices');
    const choiceElements = choicesElement.querySelectorAll('.choice');

    choiceElements.forEach((choice, index) => {
        // Update the track name and artist name displayed in each choice element
        const trackName = choice.querySelector('.track-name');
        const artistName = choice.querySelector('.artist-name');
        trackName.textContent = options[index].name;
        artistName.textContent = options[index].artist;

        // Remove any existing event listener to avoid duplicates
        if (currentChoiceHandlers[index]) {
            choice.removeEventListener('click', currentChoiceHandlers[index]);
        }

        // Define and add a new event handler for submitting the answer
        const handler = () => submitAnswer(options[index].name, currentTrack.name);
        choice.addEventListener('click', handler);

        // Store the event handler reference for future removal
        currentChoiceHandlers[index] = handler;
    });
}

// Generate options for the current question, ensuring the correct answer is included
function generateOptions(correctAnswer) {
    const options = new Set();
    options.add(correctAnswer); // Add the correct answer to the set

    // Keep adding random tracks until there are 4 options
    while (options.size < 4) {
        const randomTrack = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
        if (randomTrack.name !== correctAnswer.name) {
            options.add(randomTrack); // Add only if it is not the correct answer
        }
    }

    // Convert the set to an array and shuffle the options
    return shuffleArray(Array.from(options));
}

// Function to update the UI for text input mode
function updateTextInput() {
    const inputElement = document.getElementById('text-input');
    const suggestionsElement = document.getElementById('suggestions');
    suggestionsElement.innerHTML = ''; // Clear existing suggestions

    inputElement.addEventListener('input', () => showSuggestions(inputElement.value));

    if (!navigationListenerAdded) {
        document.addEventListener('keydown', handleSuggestionNavigation);
        navigationListenerAdded = true;
    }
}

// Function to show suggestions based on user input
function showSuggestions(query) {
    const suggestionsElement = document.getElementById('suggestions');
    if (!suggestionsElement) {
        return;
    }

    // Clear previous suggestions
    suggestionsElement.innerHTML = '';

    if (query.trim() === '') {
        suggestionsElement.style.display = 'none';
        suggestionsElement.style.opacity = '0';
        return;
    }

    // Filter quiz questions based on the query matching the track name or artist name
    const filteredTracks = quizQuestions
        .filter(track => track.name.toLowerCase().includes(query.toLowerCase()) || track.artist.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Create suggestion elements
    filteredTracks.forEach((track, index) => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.innerHTML = `<strong>${track.name}</strong><span> ${track.artist}</span>`;
        suggestionItem.addEventListener('click', () => {
            const inputElement = document.getElementById('text-input');
            inputElement.value = `${track.name} - ${track.artist}`;
            selectedTrackName = track.name; // Store the track's name
            suggestionsElement.innerHTML = ''; // Clear suggestions
            suggestionsElement.style.display = 'none';
            suggestionsElement.style.opacity = '0';
        });

        suggestionsElement.appendChild(suggestionItem);
    });

    if (filteredTracks.length > 0) {
        suggestionsElement.style.display = 'block';
        suggestionsElement.style.opacity = '1';
    } else {
        suggestionsElement.style.display = 'none';
        suggestionsElement.style.opacity = '0';
    }

    selectedIndex = -1; // Reset selected index whenever new suggestions are shown
}

// Function to handle arrow key navigation in the suggestions list
export function handleSuggestionNavigation(event) {
    const suggestionsElement = document.getElementById('suggestions');
    const suggestionItems = suggestionsElement.querySelectorAll('.suggestion-item');

    if (!suggestionsElement || suggestionItems.length === 0) {
        return;
    }

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (selectedIndex < suggestionItems.length - 1) {
                selectedIndex++;
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (selectedIndex > 0) {
                selectedIndex--;
            }
            break;
        case 'Enter':
            event.preventDefault(); // Prevent form submission
            if (selectedIndex >= 0 && selectedIndex < suggestionItems.length) {
                const selectedItem = suggestionItems[selectedIndex];
                selectedItem.click(); // Select the item
                const inputElement = document.getElementById('text-input');
                const userAnswer = inputElement.value.split(' - ')[0]; // Extract track name from input value
                const correctAnswer = currentTrack.name;
                submitAnswer(userAnswer, correctAnswer); // Submit the answer
            }
            return;
    }

    // Remove 'selected' class from all suggestion items
    suggestionItems.forEach(item => item.classList.remove('selected'));

    // Add 'selected' class to the current selected item
    if (selectedIndex >= 0 && selectedIndex < suggestionItems.length) {
        suggestionItems[selectedIndex].classList.add('selected');
        suggestionItems[selectedIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
        });
    }
}

// Function to play the song preview for the current question
export function playSong() {
    // Check if there are any quiz questions available to play
    if (quizQuestions.length === 0 || currentQuestionIndex >= quizQuestions.length) {
        console.error("No quiz data available to play song.");
        return;
    }

    // If the question is already answered, play the song for the full duration
    if (getQuestionAnswered()) {
        // console.log("Question already answered. Playing song for full duration.");
        playSongForDuration(LONG_PLAY_DURATION);
    } else {
        // If the question is not answered, play the song for a short duration and start the timers
        // console.log("Playing song for short duration and starting timers.");
        playSongForDuration(SHORT_PLAY_DURATION);
        startTimers();
        enableChoices(); // Enable choices after song starts playing
        toggleButton('submit-button', true);
    }
}

function playSongForDuration(duration) {
    // Disable play button to prevent multiple clicks and re-enable after 1s
    const playButton = document.getElementById('play-button');
    playButton.style.pointerEvents = 'none'; 
    setTimeout(() => {
        playButton.style.pointerEvents = 'auto';
    }, 1000);

    let audioElement = document.getElementById('audio-element');
    audioElement.src = currentTrack.preview_url;
    audioElement.play()
        .then(() => {
            toggleButton('stop-button', true);
        })
        .catch(error => {
            console.error('Error playing song:', error);
        });

    clearTimeout(songPlayTimeout); // Clear any existing timeout
    songPlayTimeout = setTimeout(() => {
        stopSong();
    }, duration * 1000);
}

export function stopSong() {
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
        toggleButton('stop-button', false);
    }

    clearTimeout(songPlayTimeout);
}

export function nextSong() {
    currentQuestionIndex++;
    stopSong();
    showNextQuestion();
}

// Function to submit the song
export function submitSong() {
    const userAnswer = selectedTrackName; // Store the track's name
    const correctAnswer = currentTrack.name; // Assuming currentTrack is the correct track for the current question
    submitAnswer(userAnswer, correctAnswer);
}

export function getQuestionAnswered() {
    return isQuestionAnswered;
}

export function setQuestionAnswered(value) {
    isQuestionAnswered = value;
}
