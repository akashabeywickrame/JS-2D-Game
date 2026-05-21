//Idle Animation 
var robot = document.getElementById("robot");
idleImageNumber = 1;
idleAnimationNumber = 0;

function idleAnimation(){
    idleImageNumber++;
    if( sound === "unmute"){
        //idleBackgroundSound.play();
    }
    
    if(idleImageNumber == 11){
        idleImageNumber = 1;
    }

    robot.src = "resources/idle ("+idleImageNumber+").png";
}

function idleAnimationStart(){
    idleAnimationNumber = setInterval(idleAnimation, 100);
}

//Run Animation
runImageNumber = 1;
runAnimationNumber = 0;
var runSound = new Audio("resources/run.mp3");
runSound.loop = true;

function runAnimation(){
    runImageNumber++;
    if(runImageNumber == 9){
        runImageNumber = 1;
    }

    robot.src = "resources/run ("+runImageNumber+").png"
}

function runAnimationStart(){
    runAnimationNumber = setInterval(runAnimation, 200);
    clearInterval(idleAnimationNumber);
}


//Handling the press enter text on Display
var pressEnter = document.getElementById("pressEnter");
pressEnterNumber = 0;

function hidePressEnter(){
    pressEnter.style.display = "none";
}


var startPaneClose = 0
var runStart = 0;
var startPane = document.getElementById("start").style.display = "block";

function keyCheck(event){
   // alert(event.which);
   // enter - 13
   // spacebar - 32
    var keyCode = event.which;
    
    if(keyCode == 13){
        if(startPaneClose == 1){
            startTimer();
            idleBackgroundSound.pause();
            hidePressEnter();   
            if(runAnimationNumber == 0){
                runAnimationStart();
                runStart = 1;

                if( sound === "unmute"){
                    runSound.play();
                    backgroundSound.play();  
                }         
            }
            if(moveBackgroundAnimationId == 0){
               moveBackgroundAnimationId = setInterval(moveBackground, 100)
            }
            if(boxAnimationId == 0){
             boxAnimationId = setInterval(boxAnimation,100);
            }
        }
    }            
    
    if(keyCode == 32){
        if(runStart == 1){

            if(jumpAnimationNumber == 0){
                jumpAnimationStart();
                if( sound === "unmute"){ 
                runSound.pause();
                jumpSound.play();
                }
            }    
            if(moveBackgroundAnimationId == 0){
                moveBackgroundAnimationId = setInterval(moveBackground, 100)
             }
            if(boxAnimationId == 0){
               boxAnimationId = setInterval(boxAnimation,100);   
            }
        }        
    }
}


//Setting the Time
let time = 0;
let timerInterval = 0;
var timerAnimationId = 0;

function formatTime(time){
    let minutes = Math.floor(time/60);
    let seconds = time - minutes * 60;
    let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + minutes + ":" + formattedSeconds;
}

function startTimer(){
    timerInterval = setInterval(function(){
        time++;

        document.getElementById("timer").innerHTML = formatTime(time);
    }, 1000);
}

function stopTimer(){
    clearInterval(timerInterval);    
    
}


//Background Move Animation
var backgroundImagePositionX = 0;
var moveBackgroundAnimationId = 0;

var score = 0;
var victoryPane = document.getElementById("victoryPane");

function moveBackground(){

    backgroundImagePositionX = backgroundImagePositionX -25;

    document.getElementById("background").style.backgroundPositionX = backgroundImagePositionX + "px";

    score = score + 5;
    document.getElementById("score").innerHTML = score;   

    if(score == 500){
        clearInterval(score);
        stopTimer();
        clearInterval(boxAnimationId);
        boxAnimationId = -1;

        clearInterval(runAnimationNumber);
        runAnimationNumber = -1;

        clearInterval(jumpAnimationNumber);
        jumpAnimationNumber = -1;

        clearInterval(moveBackgroundAnimationId);
        moveBackgroundAnimationId = -1;
        if( sound === "unmute"){
            runSound.pause();
            backgroundSound.pause();
            jumpSound.pause();
            levelWin.play();
        }
        
        idleAnimationNumber = setInterval(idleAnimation, 100);
        victoryPane.style.display = 'block';
        showName();
        document.getElementById("finalScore").innerHTML = score;
    }

}

//Game win - Retry
var retry = document.getElementById("retry")

retry.addEventListener('click', () =>{
    stopTimer();
    time =0;    
    document.getElementById("timer").innerHTML = "0.00";
    score = 0;
    document.getElementById("score").innerHTML = "0";
    
    startPaneClose = 1;
    runStart = 0;
    backgroundImagePositionX =0;
    runAnimationNumber = 0;
    jumpAnimationNumber = 0;
    moveBackgroundAnimationId = 0;
    boxAnimationId = 0;

    pressEnter.style.display = "block";

    victoryPane.style.display = 'none';
    keyCheck(event);
    boxAnimationId = setInterval(boxAnimation,100);    
});


//Jump Animation 
jumpAnimationNumber = 0;
jumpImageNumber = 1;
robotMarginTop = 450;
var jumpSound = new Audio("resources/jump.mp3");

function jumpAnimation(){
    jumpImageNumber++;

    if(jumpImageNumber <= 6){
        robotMarginTop = robotMarginTop -35;
        robot.style.marginTop = robotMarginTop + "px";
    }
    if(jumpImageNumber >= 7){
        robotMarginTop = robotMarginTop +35;
        robot.style.marginTop = robotMarginTop + "px";
    }

    if(jumpImageNumber == 11){
        jumpImageNumber = 1;
        clearInterval(jumpAnimationNumber);
        jumpAnimationNumber = 0;
        runImageNumber = 0;
        runAnimationStart();
        if( sound === "unmute"){
            runSound.play();
        }
    }

    robot.src = "resources/jump ("+ jumpImageNumber +").png"
}

function jumpAnimationStart(){
    clearInterval(idleAnimationNumber);
    runImageNumber = 0;
    clearInterval(runAnimationNumber);
    jumpAnimationNumber = setInterval(jumpAnimation, 100);
}

//Creating obstacles
boxMarginLeft = 1540;

function createBoxes(){
    
    for(var i = 0; i <= 2; i++){
        
        var box = document.createElement("div");
        box.className = "box";
        document.getElementById("background").appendChild(box);
        box.style.marginLeft = boxMarginLeft + "px";
        box.id = "box" + i;

        //boxMarginLeft = boxMarginLeft + 1000;

        if( i < 2){
            boxMarginLeft = boxMarginLeft + 1500;
        }
        if( i >= 2){
            boxMarginLeft = boxMarginLeft + 1000;
        }          
    }    
}

//Creating box Animations
var boxAnimationId = 0;

function boxAnimation(){

    for(var i = 0; i < 2; i++){
        var box = document.getElementById("box" + i);
        var currentMarginLeft = getComputedStyle(box).marginLeft;
        var newMarginLeft = parseInt(currentMarginLeft)-35;
        box.style.marginLeft = newMarginLeft + "px";   

        if(newMarginLeft >= -100 && newMarginLeft <= 105) {
            
            if(robotMarginTop > 400){
                stopTimer();
                clearInterval(boxAnimationId);
        
                clearInterval(runAnimationNumber);
                runAnimationNumber = -1;
        
                clearInterval(jumpAnimationNumber);
                jumpAnimationNumber = -1;
        
                clearInterval(moveBackgroundAnimationId);
                moveBackgroundAnimationId = -1;

                deadAnimationNumber = setInterval(robotDeathAnimation,100);                                
                if( sound === "unmute"){
                    runSound.pause();
                    deadSound.play();
                    backgroundSound.pause();
                    idleBackgroundSound();
                }
            }
            
        }      
        
    }
}

//function restartBoxAnimation(){
//    clearInterval(boxAnimationId);
//    boxesCreated = false;
//    boxMarginLeft = 1540;
//    createBoxes();
//    boxAnimationId = setInterval(boxAnimation, 100);
//}

//Death Animations
var deadImageNumber = 1;
var deadAnimationNumber = 0;
var deadSound = new Audio("resources/man-dying-89565.mp3");

function robotDeathAnimation(){
    deadImageNumber++;
    if(deadImageNumber == 11){
        deadImageNumber = 10;

        document.getElementById("robot").style.marginTop = "450px";
        document.getElementById("end").style.visibility = "visible";
        document.getElementById("endScore").innerHTML = score;
    }

    robot.src = "resources/Dead ("+ deadImageNumber +").png";
}

//function to restart the game
function reload(){

    location.reload();
}

// Loading the background sound file
const backgroundSound = new Audio("resources/space-background.mp3");
const idleBackgroundSound = new Audio("resources/cinematic-cello.mp3")
const levelWin = new Audio("resources/level-win.mp3");

//setting the initial volume to 50%
backgroundSound.volume = 0.4;
backgroundSound.loop = true;


idleBackgroundSound.volume = 0.4;

//Handling the speaker icon
let sound = "unmute";

function changeImage(){
    var soundImage = document.getElementById("loudBtn");

    if(soundImage.src.match("loudSpeaker")){
        if( sound === "unmute" ){
            sound = "mute"
            soundImage.src = "resources/muteSpeaker.png";
            backgroundSound.pause();
            idleBackgroundSound.pause();
        }        

    }else{
        if( sound === "mute"){
            sound = "unmute"
            soundImage.src = "resources/loudSpeaker.png";
        }        
    }
}


//Handling the players Name
const form = document.querySelector('form');
const input = document.querySelector('#playName');
const closePane = document.getElementById("start");
var playerNumber = 0;

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const playerName = input.value;
    console.log("Player name is " + playerName);    
    closePane.style.visibility = "hidden";
    startPaneClose++;
    showName();
});

function showName(){
    const nameInput = document.getElementById("playName").value;
    const name = document.getElementById("name");
    const winnerName = document.getElementById("winnerName");

    name.innerHTML = ""+ nameInput;
    winnerName.innerHTML = nameInput;
}

//Handling the displaying of the info pane
const infoBtn = document.getElementById("infoBtn");
const infoPane = document.getElementById("infoPane");

infoBtn.addEventListener('click', () => {
    if(infoPane.style.display === 'none'){
        infoPane.style.display = 'block';
        infoPane.style.transition = 'opacity 0.3s ease-in-out';
    }else{
        infoPane.style.display = 'none';
    }
});



//Handling Lobby
const lobby = document.getElementById("lobby")

lobby.addEventListener("click", () => {
    reload();
});
