// quiz/leaderboard.js

export async function initLeaderboard() {
    await fetchTopLeaderboard();
    initEventHandlers();
}

async function fetchLeaderboard(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        populateLeaderboard(data.leaderboard || data.total_leaderboard);
    } catch (error) {
        console.error(`Error fetching data:`, error);
    }
}

async function fetchTopLeaderboard() {
    return fetchLeaderboard('/quiz/leaderboard');
}

async function fetchTotalLeaderboard() {
    return fetchLeaderboard('/quiz/total-leaderboard');
}

function populateLeaderboard(data) {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '';

    data.forEach((entry, index) => {
        const li = document.createElement('li');
        li.classList.add('leaderboard-entry');
        li.innerHTML = `
            <div class="entry-rank">${index + 1}</div>
            <div class="entry-info">
                <div class="username">${entry.display_name}</div>
                <div class="userid">${entry.username}</div>
            </div>
            <div class="entry-score">${entry.score || entry.total_score}</div>
        `;
        leaderboard.appendChild(li);
    });
}

function updateDropdownText(text) {
    // console.log(`Updating dropdown text to: ${text}`);
    const dropdownBtn = document.querySelector('.btn-dropdown-leaderboard');
    dropdownBtn.innerHTML = `${text} <span class="dropdown-button-logo">&#x25BC;</span>`; 
}

function initEventHandlers() {
    const leaderboardDropDownButton = document.querySelector('.btn-dropdown-leaderboard');
    const leaderboardDropDownContent = document.querySelector('.dropdown-content-leaderboard');

    if (leaderboardDropDownButton) {
        leaderboardDropDownButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from bubbling up
        leaderboardDropDownContent.classList.toggle('show');
        });

        document.addEventListener('click', (event) => {
            // If the clicked target is not the dropdown button, remove the 'show' class
            if (!leaderboardDropDownButton.contains(event.target)) {
                leaderboardDropDownContent.classList.remove('show');
            }
        });
    }

    // Add click event listener to the 'Total Scores' link in the dropdown content
    document.querySelector('.dropdown-content-leaderboard a[href="#total-scores"]').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        updateDropdownText('Total Scores');
        fetchTotalLeaderboard();
    });

    // Add click event listener to the 'Top Scores' link in the dropdown content
    document.querySelector('.dropdown-content-leaderboard a[href="#top-scores"]').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        updateDropdownText('Top Scores'); 
        fetchTopLeaderboard();
    });
}

