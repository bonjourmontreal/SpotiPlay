// quiz/quizCustomization.js

document.addEventListener('DOMContentLoaded', function() {
    // console.log("DOM content loaded");

    const playQuizButton = document.getElementById('play-quiz-button');
    const startQuizButton = document.getElementById('start-quiz-button');
    const modal = document.getElementById('quiz-customization-modal');
    const closeModal = document.querySelector('.close');
    const quizTypeToggle = document.getElementById('quiz-type-toggle');

    function addEventListeners() {
        playQuizButton.addEventListener('click', handlePlayQuizButtonClick);
        closeModal.addEventListener('click', handleCloseModalClick);
        window.addEventListener('click', handleOutsideModalClick);
        startQuizButton.addEventListener('click', handleStartQuizButtonClick);
    }
    
    function handlePlayQuizButtonClick() {
        // console.log("Play Quiz button clicked");
        showModal();
    }
    
    function showModal() {
        // console.log("Show modal");
        modal.style.display = 'flex';
    }
    
    function handleCloseModalClick() {
        // console.log("Close button clicked");
        modal.style.display = 'none';
    }

    function handleOutsideModalClick(event) {
        if (event.target === modal) {
            // console.log("Clicked outside the modal");
            modal.style.display = 'none';
        }
    }

    function handleStartQuizButtonClick() {
        // console.log("Start Quiz button clicked");

        // Retrieve selected values
        const globalTime = document.getElementById('global-time').value;
        const songDuration = document.getElementById('song-duration').value;
        const timePeriod = document.getElementById('time-period').value;
        const quizType = quizTypeToggle.checked ? 'multiple-choice' : 'text-input';

        // Store the values in localStorage
        storeQuizSettings(globalTime, songDuration, timePeriod, quizType);

        // Get the quiz URL from the data attribute
        const quizUrl = playQuizButton.getAttribute('data-quiz-url');

        // Redirect to quiz view
        window.location.href = quizUrl;
    }

    function storeQuizSettings(globalTime, songDuration, timePeriod, quizType) {
        localStorage.setItem('globalTime', globalTime);
        localStorage.setItem('songDuration', songDuration);
        localStorage.setItem('timePeriod', timePeriod);
        localStorage.setItem('quizType', quizType);
    }

    function checkShowModalFlag() {
        if (sessionStorage.getItem('showModal') === 'true') {
            showModal();
            sessionStorage.removeItem('showModal'); // Clear the flag after showing the modal
        }
    }

    // Initialize event listeners and check the modal flag
    addEventListeners();
    checkShowModalFlag();
});
