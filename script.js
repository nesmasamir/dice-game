'use strict';

//select elements
const player0El = document.getElementById("player-0");
const player1El = document.getElementById("player-1");
const globalScore = document.querySelectorAll(".global-score"); //  nodelist of global scors for both players array
const currentScore = document.querySelectorAll(".current-score"); // list of the current score of one of both players
const diceImgEL = document.querySelector(".dice"); // the image of dice 
const rollDiceEl = document.querySelector(".roll-dice-btn");
const holdEl = document.querySelector(".hold-btn");
const restGameEl = document.querySelector(".reset-btn");
const winnerUser = document.createElement("div");
winnerUser.textContent = "The Winner"




// variables using in the functionality
let score = 0;
let activePlayer = 0;
let accumlatedScore = [0, 0];
let playing = true;

//set current score to zero and change the player
function changePlayer() {
    score = 0;
    currentScore[activePlayer].textContent = score;
    activePlayer = activePlayer === 0 ? 1 : 0;
    player0El.classList.toggle('active-player');
    player1El.classList.toggle('active-player');

}


// rolling dice functionality
rollDiceEl.addEventListener('click', function () {
    if (playing) {
        //1. create number fro 1 to 6
        let dice = Math.trunc(Math.random() * 6) + 1;

        //2. create a dice from 1 to 6 and show the img of dice
        diceImgEL.classList.remove('hide-dice');
        diceImgEL.src = `imgs/dice-${dice}.png`;

        //3. acummelate dice numbers in the current score if dice not ===1

        if (dice !== 1) {
            score += dice;
            currentScore[activePlayer].textContent = score;
        }

        //4. if dice ===1 set the current player score  to zero and  gchange to the  other player
        else {
            changePlayer()
        }
    }
})


// hold the dice and store current score in the global score check the winner
holdEl.addEventListener('click', function () {

    if (playing) {
        accumlatedScore[activePlayer] += score;
        globalScore[activePlayer].textContent = accumlatedScore[activePlayer];

        // check if the accumlated score is >+10 and get the winner and stopthe game
        if (accumlatedScore[activePlayer] >= 10) {
            playing = false;
            winnerUser.classList.add("winner-text")
            document.getElementById(`player-${activePlayer}`).classList.remove("active-player");
            document.getElementById(`player-${activePlayer}`).classList.add("winner-player");
            document.getElementById(`player-${activePlayer}`).insertAdjacentElement("afterbegin", winnerUser)
            rollDiceEl.setAttribute("disabled", "true")
            holdEl.setAttribute("disabled", "true")



        }
        // check if score less than 10 so continuo playing
        else {
            changePlayer();

        }
    }

})




// new game functonality
restGameEl.addEventListener("click", function () {

    winnerUser.remove();

    //1.rest the dice img "hide it"
    diceImgEL.classList.add("hide-dice");

    //2. reset score and global score to 0
    score = 0;
    activePlayer = 0;
    accumlatedScore = [0, 0];
    playing = true;

    //looping current score node list and set the 0 value
    for (let i = 0; i < currentScore.length; i++) {
        currentScore[i].textContent = score;
    }

    //looping global score node list and set the 0 value
    for (let i = 0; i < globalScore.length; i++) {
        globalScore[i].textContent = accumlatedScore[i];

    }


    //3.change the background to the default value
    if (player0El.classList.contains("winner-player") || !player0El.classList.contains("active-player")) {
        player0El.classList.add("active-player")
        player0El.classList.remove("winner-player")
        player1El.classList.remove("active-player")
        player1El.classList.remove("winner-player")

    }


    // holdEl.setAttribute("disabled", "false")
    if (rollDiceEl.getAttribute("disabled") == "true" && holdEl.getAttribute("disabled") == "true") {
        rollDiceEl.removeAttribute("disabled")
        holdEl.removeAttribute("disabled")
        

    }
    





})