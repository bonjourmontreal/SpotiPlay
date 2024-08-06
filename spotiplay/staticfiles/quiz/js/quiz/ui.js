// ui.js
import { playSong, stopSong, nextSong, submitSong, handleSuggestionNavigation } from './questionHandling.js';


export function mainInitializers() {
    initDropdown();
}

function initDropdown() {
    const dropdownButton = document.querySelector('.btn-dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (dropdownButton) {
        dropdownButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownContent.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            if (!dropdownButton.contains(event.target)) {
                dropdownContent.classList.remove('show');
            }
        });
    }
}

export function hideLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const quizContainer = document.getElementById('quiz-container');
    
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    if (quizContainer) {
        quizContainer.style.display = 'flex';
    }
};

export function initEventHandlers() {
    const playButton = document.getElementById('play-button');
    const stopButton = document.getElementById('stop-button');
    const nextButton = document.getElementById('next-button');
    const submitButton = document.getElementById('submit-button');

    if (playButton) playButton.addEventListener('click', playSong);
    if (stopButton) stopButton.addEventListener('click', stopSong);
    if (nextButton) nextButton.addEventListener('click', nextSong);
    if (submitButton) submitButton.addEventListener('click', submitSong);

    document.addEventListener('keydown', handleSuggestionNavigation);
}

export function updateNextQuestionUI(currentQuestionIndex) {
    updateQuestionNumber(currentQuestionIndex);
    clearNotifications();
    resetChoicesState();
    disableChoices();
    resetTextInputState();
}

function updateQuestionNumber(currentQuestionIndex) {
    // Update the question number display
    const questionNumberElement = document.getElementById('question-number');
    questionNumberElement.textContent = `Q${currentQuestionIndex + 1}`;
}

function resetChoicesState() {
    document.querySelectorAll('.choice').forEach(choice => {
        choice.className = 'choice'; // Reset class to only 'choice'
        choice.style.pointerEvents = 'auto';
    });
}

function resetTextInputState() {
    const inputElement = document.getElementById('text-input');
    const correctAnswerElement = document.getElementById('correct-answer');
    
    inputElement.value = ''; // Clear the text input field
    inputElement.classList.remove('correct');
    inputElement.classList.remove('incorrect');
    correctAnswerElement.style.display = 'none';
    correctAnswerElement.textContent = '';
}

export function enableChoices() {
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {
        choice.classList.remove('disabled');
        choice.style.pointerEvents = 'auto';
    });
}

export function disableChoices() {
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {
        choice.classList.add('disabled');
        choice.style.pointerEvents = 'none';
    });
}

export function toggleButton(buttonId, isEnabled) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (isEnabled) {
        button.classList.remove('disabled');
        button.disabled = false;
    } else {
        button.classList.add('disabled');
        button.disabled = true;
    }
}

export function showNotification(isCorrect, points, isUnanswered = false) {
    const notificationElement = document.getElementById('points-notification');
    notificationElement.style.display = 'inline';
    notificationElement.textContent = `${isCorrect ? '+' : '+'}${points}`;
    if (isUnanswered) {
        notificationElement.style.color = '#FFFF44';
    } else {
        notificationElement.style.color = isCorrect ? '#19a54a' : '#FF4136';
    }

    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 2000);
}

function clearNotifications() {
    const notificationElement = document.getElementById('points-notification');
    if (notificationElement) {
        notificationElement.style.display = 'none';
        notificationElement.textContent = '';
        notificationElement.style.color = ''; // Reset color to default
    }
}
