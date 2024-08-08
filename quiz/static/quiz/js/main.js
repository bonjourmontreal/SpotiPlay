// main.js

import { initQuiz } from './quiz/index.js';
import { initLeaderboard } from './quiz/leaderboard.js';
import { hideLoadingOverlay, mainInitializers } from './quiz/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    mainInitializers();

    const body = document.querySelector('body');
    const page = body.getAttribute('data-page');
    // console.log("Current page:", page);
    
    if (page === 'quiz') {
        await initQuiz();
        hideLoadingOverlay();
    } else if (page === 'leaderboard') {
        initLeaderboard();
    }
});