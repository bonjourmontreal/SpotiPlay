// quiz/results.js

document.addEventListener('DOMContentLoaded', function() {

    const playAgainButton = document.getElementById('play-again-button');

    function addEventListener() {
        playAgainButton.addEventListener('click', handlePlayAgainButtonClick); 
    }
    
    function handlePlayAgainButtonClick() {
        // Set a flag in sessionStorage
        sessionStorage.setItem('showModal', 'true');

        // Redirect to the welcome page
        const welcomeUrl = playAgainButton.getAttribute('data-welcome-url');
        window.location.href = welcomeUrl;
    };

    addEventListener();
});