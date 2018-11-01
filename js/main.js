// A list that holds all of your cards
const icons = [
    'fa-parachute-box', 'fa-parachute-box',
    'fa-plane', 'fa-plane',
    'fa-anchor', 'fa-anchor',
    'fa-fish', 'fa-fish',
    'fa-glass-martini', 'fa-glass-martini',
    'fa-globe-americas', 'fa-globe-americas',
    'fa-bicycle', 'fa-bicycle',
    'fa-umbrella-beach', 'fa-umbrella-beach'
];

const starsDiv = document.querySelector('.stars');
const restartBtn = document.querySelector('.restart');
const movesDiv = document.querySelector('.moves-span');
const timeDiv = document.querySelector('#time');
const cardsContainer = document.querySelector('.cards');
const playAgainBtn = document.querySelector('#play-again-button');
const modal = document.querySelector('#modal');
const movesModal = document.querySelector('#moves-number');
const starsModal = document.querySelector('#stars-info');
const secondsModal = document.querySelector('#seconds-number');

let movesCounter = 0;
let timeCounter = 0;
let firstTime = true;
let interval;
let openCards = [];
let hits = 0;
let starsCounter = 3;

timeDiv.innerHTML = timeCounter;
movesDiv.innerHTML = movesCounter;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Display the card's symbol
function showCard(card) {
    card.classList.add('open');
}

// Add the card to a *list* of 'open' cards
function addCard(card) {
    openCards.push(card);
}

// Lock the cards in the open position
function showMatch(card1, card2) {
    card1.classList.add('match', 'match-in');
    card2.classList.add('match', 'match-in');

    setTimeout(function() {
        card1.classList.remove('match-in');
        card2.classList.remove('match-in');
    }, 300)
}

// Remove the cards from the list and hide the card's symbol
function showError(card1, card2) {
    openCards = [];
    card1.classList.add('error');
    card2.classList.add('error');
    setTimeout(function () {
        // When the animation ends -> drop animation
        card1.classList.remove('error', 'open');
        card2.classList.remove('error', 'open');
    }, 800)
}

// Display a message with the final score
function showModal() {
    modal.style.display = 'block';
    clearInterval(interval);
    movesModal.innerHTML = movesCounter;
    starsModal.innerHTML = starsCounter;
    secondsModal.innerHTML = timeCounter;
}

// Check if we have a match
function compareCards(card1, card2) {
    const classFirst = card1.children[0].classList[1];
    const classSecond = card2.children[0].classList[1];

    // If the cards are the same
    if (card1.isSameNode(card2)) {
        showError(card1, card2);
        // If the cards do match
    } else if (classFirst === classSecond) {
        showMatch(card1, card2);
        hits++;
        openCards = [];

        // To check if the game is over
        if (hits === 8) {
            showModal();
        }
        // If the cards do not match
    } else {
        showError(card1, card2);
    }
}

// Increment the time counter and display it on the page
function incrementTime() {
    timeCounter++;
    timeDiv.innerHTML = timeCounter;
}

// Increment the move counter and display it on the page
function incrementMoves() {
    movesCounter++;
    movesDiv.innerHTML = movesCounter;
}

// Initialize the board
function init() {
    // Shuffle the list of cards using the provided 'shuffle' method below
    const iconsShuffled = shuffle(icons)
    // To debug only.
    // const iconsShuffled = icons;

    // Loop through each card:
    icons.forEach(function (icon) {
        // - create its HTML
        // <li class="card"><i class="fas fa-globe-americas'></i></li>
        const card = document.createElement('li');
        card.classList.add('card');
        card.innerHTML = `<i class="fas ${icon}"></i>`;
        // - add each card's HTML to the page
        cardsContainer.appendChild(card);

        // Set up the event listener for a card. If a card is clicked
        card.addEventListener('click', function () {
            incrementMoves()

            if (firstTime === true) {
                interval = setInterval(incrementTime, 900);
                firstTime = false;
            }

            if (movesCounter === 30) {
                starsDiv.children[0].style.display = 'none';
                starsCounter--;
            }
            if (movesCounter === 45) {
                starsDiv.children[1].style.display = 'none';
                starsCounter--;
            }
            if (movesCounter === 60) {
                starsDiv.children[2].style.display = 'none';
                starsCounter--;
            }

            showCard(card);
            addCard(card);

            // If the list already has two cards, it if both match
            if (openCards.length === 2) {
                compareCards(openCards[0], openCards[1]);
            }
        });
    });
}

init();

// Restart the game
function reset() {
    movesCounter = 0;
    movesDiv.innerHTML = movesCounter;
    timeCounter = 0;
    timeDiv.innerHTML = timeCounter;
    starsCounter = 3;
    clearInterval(interval);
    cardsContainer.innerHTML = '';
    starsDiv.children[0].style.display = 'inline';
    starsDiv.children[1].style.display = 'inline';
    starsDiv.children[2].style.display = 'inline';
    firstTime = true;

    init();
}

// Buttons handlers

restartBtn.addEventListener('click', reset);

playAgainBtn.addEventListener('click', function () {
    reset();
    modal.style.display = 'none';
});