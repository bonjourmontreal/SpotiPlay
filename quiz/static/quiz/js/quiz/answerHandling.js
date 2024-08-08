// quiz/answerHandling.js
import { stopSong, currentTrack, setQuestionAnswered } from './questionHandling.js';
import { stopTimers, stopProgressBarTransition, QUESTION_TIMER_DURATION } from './timer.js';
import { showNotification, disableChoices, toggleButton } from './ui.js';
import { getCsrfToken } from './utils.js';

let score = 0;

export function submitAnswer(userAnswer, correctAnswer) {

    stopSong();
    stopTimers('submitAnswer');
    stopProgressBarTransition();
    setQuestionAnswered(true);

    // console.log(`User selected track: ${userAnswer}`);
    // console.log(`Correct track: ${correctAnswer}`);
    disableChoices()
    highlightAnswers(userAnswer, correctAnswer);

    const isCorrect = userAnswer === correctAnswer;
    updateScore(isCorrect);

    toggleButton('next-button', true);
    toggleButton('play-button', true);
    toggleButton('submit-button', false);
}

export function highlightAnswers(userAnswer, correctAnswer) {
    document.querySelectorAll('.choice').forEach(choice => {
        const choiceTrackName = choice.querySelector('.track-name').innerText;
        
        // Add the appropriate class based on the choiceTrackName
        if (choiceTrackName === correctAnswer) {
            choice.classList.add(userAnswer ? 'correct' : 'unanswered');
        } else if (choiceTrackName === userAnswer) {
            choice.classList.add('wrong');
        }
    });

    // Handle text input highlighting and correct answer display
    const textInput = document.getElementById('text-input');
    const correctAnswerElement = document.getElementById('correct-answer');

    if (userAnswer === correctAnswer) {
        textInput.classList.add('correct');
        textInput.classList.remove('incorrect');
        correctAnswerElement.style.display = 'none';
    } else {
        textInput.classList.add('incorrect');
        textInput.classList.remove('correct');
        correctAnswerElement.style.display = 'block';
        correctAnswerElement.textContent = `Correct Answer: ${currentTrack.name} - ${currentTrack.artist}`;
    }
}

export function handleQuestionEnd() {
    stopSong();
    stopTimers('handleQuestionEnd');
    disableChoices();

    setQuestionAnswered(true);
    highlightAnswers(null, currentTrack.name);
    showNotification(false, 0, true);

    toggleButton('next-button', true);
    toggleButton('play-button', true);
    toggleButton('submit-button', false);
}

export function endGame() {
    // console.log('End Game initiating...');
    submitScore(score);
}

export async function submitScore(score) {
    const csrfToken = getCsrfToken();
    const response = await fetch('/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ score: score })
    });

    if (response.status === 401) {
        window.location.href = '/auth';
        return;
    }

    const data = await response.json();
    if (data.status === 'success') {
        // console.log(`Score submitted successfully: ${score}`);
        setTimeout(() => {
            window.location.href = '/results';
        }, 2000);
    } else {
        // console.error('Error submitting score:', data.error);
    }
}

function calculatePoints(isCorrect) {
    if (!isCorrect) return 0;

    const questionTimerBar = document.getElementById('question-timer-bar');
    const parentWidth = questionTimerBar.parentElement ? questionTimerBar.parentElement.offsetWidth : 0;
    const currentWidth = questionTimerBar.offsetWidth;
    const timeRemaining = (currentWidth / parentWidth) * QUESTION_TIMER_DURATION;
    
    return Math.max(50, Math.min(100, Math.round(50 + (50 * timeRemaining / QUESTION_TIMER_DURATION))));
}

function updateScore(isCorrect) {
    const points = calculatePoints(isCorrect);
    score += points;
    showNotification(isCorrect, points);

        // Update the displayed score
        const scoreDisplay = document.getElementById('score');
        scoreDisplay.textContent = score;
}

