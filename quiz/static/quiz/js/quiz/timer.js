// quiz/timer.js

import { handleQuestionEnd, endGame } from './answerHandling.js';
import { getQuestionAnswered } from './questionHandling.js';

export let GLOBAL_TIMER_DURATION
export let QUESTION_TIMER_DURATION = 10; // Default question timer duration in seconds
export let SHORT_PLAY_DURATION
export let LONG_PLAY_DURATION = 30; // Default long play duration in seconds

let globalTimer;
let globalTimeLeft = GLOBAL_TIMER_DURATION;
let questionTimer;
let isGlobalTimerRunning = false;


export function setGlobalTimerDuration(duration) {
    GLOBAL_TIMER_DURATION = duration;
    globalTimeLeft = duration;
}

export function setSongPlayDuration(duration) {
    SHORT_PLAY_DURATION = duration;
}

export function initTimer() {
    setupGlobalTimer();
}

export function startTimers() {
    if (!getQuestionAnswered() && globalTimeLeft > 0 && !isGlobalTimerRunning) {
        startGlobalTimer();
        startProgressBarTransition();
        isGlobalTimerRunning = true;
    }
}

function startGlobalTimer() {
    const interval = 100; // Update every 100ms for smoother transition
    globalTimer = setInterval(() => {
        globalTimeLeft -= interval / 1000;
        const timeLeftRounded = Math.ceil(globalTimeLeft);
        updateGlobalTimer(globalTimeLeft, timeLeftRounded);

        if (globalTimeLeft <= 0) {
            clearInterval(globalTimer);
            globalTimer = null;
            isGlobalTimerRunning = false;

            stopProgressBarTransition();
            handleQuestionEnd();
            endGame();
        }
    }, interval);
}

export function stopTimers(source = '') {
    console.log(`Stopping all timers from: ${source}`);
    if (globalTimer) {
        clearInterval(globalTimer);
        globalTimer = null;
        isGlobalTimerRunning = false;
    }
    if (questionTimer) {
        clearTimeout(questionTimer);
        questionTimer = null;
    }
}

function setupGlobalTimer() {
    const circle = document.getElementById('global-circle');
    if (!circle) {
        console.error("Circle element not found in setupGlobalTimer");
        return;
    }
    document.getElementById('global-time').textContent = Math.ceil(globalTimeLeft);

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = 0;
}

function updateGlobalTimer(timeLeft, timeLeftRounded) {
    const circle = document.getElementById('global-circle');
    const text = document.getElementById('global-time');
    if (!circle) {
        console.error("Circle element not found in updateGlobalTimer");
        return;
    }

    text.textContent = timeLeftRounded;
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    const offset = circumference - (timeLeft / GLOBAL_TIMER_DURATION) * circumference;
    circle.style.strokeDashoffset = offset > circumference ? circumference : offset;
}

export function resetQuestionTimer() {
    resetProgressBar();
}

function resetProgressBar() {
    const questionTimerBar = document.getElementById('question-timer-bar');
    questionTimerBar.style.transition = 'none';
    questionTimerBar.style.width = '100%';
    questionTimerBar.style.backgroundColor = '#1DB954 !important';
    questionTimerBar.style.animation = 'none';
}

function startProgressBarTransition() {
    const questionTimerBar = document.getElementById('question-timer-bar');

    questionTimerBar.style.transition = `width ${QUESTION_TIMER_DURATION}s linear`;
    questionTimerBar.style.width = '0%';
    questionTimerBar.style.animation = `colorTransition ${QUESTION_TIMER_DURATION}s linear`;

    questionTimer = setTimeout(() => {
        handleQuestionEnd();
    }, QUESTION_TIMER_DURATION * 1000);
}

export function stopProgressBarTransition() {
    const questionTimerBar = document.getElementById('question-timer-bar');

    const computedStyle = window.getComputedStyle(questionTimerBar);
    const currentWidth = computedStyle.width;

    questionTimerBar.style.transition = 'none';
    questionTimerBar.style.width = currentWidth;
    questionTimerBar.style.animation = 'none';
}
