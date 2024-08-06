// quiz/index.js

import { initQuestions } from './questionHandling.js';
import { initTimer, setGlobalTimerDuration, setSongPlayDuration } from './timer.js';
import { initEventHandlers } from './ui.js';

const DEFAULT_GLOBAL_TIME = 5;  // Default global time in seconds
const DEFAULT_SONG_DURATION = 2; // Default song snippet length in seconds

export async function initQuiz() {
    const globalTime = localStorage.getItem('globalTime') || DEFAULT_GLOBAL_TIME;
    const songDuration = localStorage.getItem('songDuration') || DEFAULT_SONG_DURATION;
    setGlobalTimerDuration(parseInt(globalTime));
    setSongPlayDuration(parseInt(songDuration));

    await initQuestions();
    initTimer();
    initEventHandlers();
}
