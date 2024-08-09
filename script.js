'use strict';

//selecting  html elements
const player0El = document.getElementById("player-0");
const player1El = document.getElementById("player-1");
const globalScore = document.querySelectorAll(".global-score"); //  nodelist of global scors for both players array
const currentScores = document.querySelectorAll(".current-score"); // list of the current score of one of both players
const diceImgEL = document.querySelector(".dice"); // the image of dice 
const beginDiceImg = document.querySelector(".begin-dice")
const rollDiceBtn = document.querySelector(".roll-dice-btn");
// const holdBtn = document.querySelector(".hold-btn");
const resetBtn = document.querySelector(".reset-btn");
const winnerUser = document.createElement("div");
const celebratAudio = document.querySelector("audio");
winnerUser.textContent = "The Winner";

// audio promise
let playPromise;
let timeoutSwapTurn;

// variables using in the functionality
let score = 0;
let activePlayer = 0;
let accumlatedScore = [0, 0];
let playing = true;

// change the player and set current score to zero 
function changePlayer() {
    score = 0;
    currentScores[activePlayer].textContent = score;
    activePlayer = activePlayer === 0 ? 1 : 0;
    player0El.classList.toggle('active-player');
    player1El.classList.toggle('active-player');
}


function changeRollBtnState(rollbtn, rollAttribute) {
    rollbtn == "activ" ? rollDiceBtn.classList.add('activ-btn') : rollDiceBtn.classList.remove('activ-btn');
    rollAttribute == "remove" ? rollDiceBtn.removeAttribute('disabled') : rollDiceBtn.setAttribute("disabled", "true");
}

function toggleDiceImgState(isHiddenDice, isHiddendiceGif) {
    isHiddenDice ? diceImgEL.classList.add("hide-dice") : diceImgEL.classList.remove("hide-dice");
    isHiddendiceGif ? beginDiceImg.classList.add("hide-dice") : beginDiceImg.classList.remove("hide-dice")
}

function swapTurns() {
    timeoutSwapTurn = setTimeout(() => {
        toggleDiceImgState(true, false)
        changeRollBtnState( "activ", "remove");
        accumlatedScore[activePlayer] += score;
        globalScore[activePlayer].textContent = accumlatedScore[activePlayer];

        // check if the accumlated score is >+10 and get the winner and stopthe game
        if (accumlatedScore[activePlayer] >= 10) {
            playing = false;
            winnerUser.classList.add("winner-text");
            document.getElementById(`player-${activePlayer}`).classList.remove("active-player");
            document.getElementById(`player-${activePlayer}`).classList.add("winner-player");
            document.getElementById(`player-${activePlayer}`).insertAdjacentElement("afterbegin", winnerUser);
            resetBtn.classList.add('activ-reset-btn');
            changeRollBtnState( "inactiv", "add");
            // celebratAudio.play();
            playPromise = celebratAudio.play();
            currentScores[activePlayer].textContent = 0;
        }

        // check if score less than 10 so continuo playing
        else {
            changePlayer();
        }
    }, 1000);

}

// rolling dice 
rollDiceBtn.addEventListener('click', function () {
    if (playing) {
        //1. create number from 1 to 6
        let dice = Math.trunc(Math.random() * 6) + 1;

        //2. create a dice from 1 to 6 and show the img of dice
        diceImgEL.src = `imgs/dice-${dice}.png`;
        toggleDiceImgState(false, true);

        //3. acummelate dice numbers in the current score if dice !==1
        if (dice !== 1) {
            score += dice;
            currentScores[activePlayer].textContent = score;
            changeRollBtnState( "inactiv", "add");
            swapTurns()
        }

        //4. if dice ===1 set the current player score  to zero and  swap to the second player
        else {

            swapTurns()
            changeRollBtnState( "inactiv", "add")
        }

    }
})



// reset button 
resetBtn.addEventListener("click", function () {
    clearTimeout(timeoutSwapTurn);
    celebratAudio.currentTime = 0;
    if (playPromise !== undefined) {
        playPromise.then(() => {
            celebratAudio.pause();
            playPromise = undefined;
        })
    }
    resetBtn.classList.remove('activ-reset-btn');
    winnerUser.remove();
    // reset buttons
    changeRollBtnState( "activ", "remove")

    //1.rest the dice imgs
    toggleDiceImgState(true, false)

    //2. reset score and global score to 0
    score = 0;
    activePlayer = 0;
    accumlatedScore = [0, 0];
    playing = true;

    //looping current score node list and set the 0 value
    for (let i = 0; i < currentScores.length; i++) {
        currentScores[i].textContent = score;
    }

    //looping global score node list and set the 0 value
    for (let i = 0; i < globalScore.length; i++) {
        globalScore[i].textContent = accumlatedScore[i];
    }

    //3.change the background to the default value
    if (player0El.classList.contains("winner-player") || !player0El.classList.contains("active-player")) {
        player0El.classList.add("active-player");
        player0El.classList.remove("winner-player");
        player1El.classList.remove("active-player");
        player1El.classList.remove("winner-player");
    }

})