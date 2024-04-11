const canvas = document.getElementById('canvas')

document.body.style.backgroundColor = 'black'

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const context = canvas.getContext('2d')

const blocksX = 10
const blocksY = 20
const blockDimension = 30
const colors = {
    I: 'cyan',
    J: '#FF69B4',
    L: '#FF7F00',
    O: '#FFD700',
    S: 'red',
    T: '#A020F0',
    Z: '#7FFF00'
};
const audio = document.getElementById("tetris-soundtrack");
const clearSound = new Audio("/sounds/cute-level-up-3-189853.mp3")
const backgroundSound = new Audio("/sounds/original-tetris-theme-tetris-soundtrack-made-with-Voicemod.mp3")
const gameOverSound = new Audio("/sounds/smb_mariodie.wav")
const crowdCheer = new Audio("/sounds/crowd-cheer-ii-6263.mp3")

let lastTime = Date.now();
let fps = 0;
let offset = 0
let frameCount = 0

let chosenTetrominos = 0
let activeMinos = 0
let activeColor = ""
let minosPosition = { x: 0, y: 0 };
let nextTetromino = null;

let mazeState = []

let I = { name: 'I', shape: [[1, 1, 1, 1],] };

let J = { name: 'J', shape: [[1, 0, 0],
                                                   [1, 1, 1],] };

let L = { name: 'L', shape: [[0, 0, 1],
                                                   [1, 1, 1],] };

let O = { name: 'O', shape: [[1, 1],
                                                   [1, 1],] };

let S = { name: 'S', shape: [[0, 1, 1],
                                                   [1, 1, 0],] };

let T = { name: 'T', shape: [[0, 1, 0],
                                                   [1, 1, 1]] };

let Z = { name: 'Z', shape: [[1, 1, 0],
                                                   [0, 1, 1]] };
const array = [I, J, L, O, S, T, Z];
let highscore;
let clear = false

let gameStarted = false;

let gameOver = false;

backgroundSound.loop = true;

gameOverSound.loop = false;
let crowdCheerSoundPlayed = false
crowdCheer.loop = true;
let gameOverSoundPlayed = false;

// gameOverSound.loop = false;

let score = 0;
let startBlockX = (canvas.width/2)-(blockDimension*2)

let startBlockY = (canvas.height/2)-((blocksY*blockDimension)/2)

gameOverSound.addEventListener('ended', function () {
    this.currentTime = 0;
    this.pause();
}, false);


let gameOverOverlay = document.getElementById('game-over-overlay');
let gameOverText = document.getElementById('game-over-text');






addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            if ((startBlockX>(canvas.width/2)-(blocksX*blockDimension)/2) && offset<blocksY*blockDimension-31){
                startBlockX-=blockDimension
            }
            break
        case 'ArrowRight':
            if ((startBlockX<(canvas.width/2)+((blocksX*blockDimension)/2)-(activeMinos[0].length*blockDimension)) && (offset<blocksY*blockDimension-31)){
                startBlockX+=blockDimension
            }
            break
        case 'ArrowDown':
            if(offset < blocksY * blockDimension - activeMinos.length*blockDimension) {
                offset += 30
            }
            break
        case 'ArrowUp':
            if ((activeMinos.length === 4) && (startBlockX+60>=(canvas.width/2)+((blocksX*blockDimension)/2)-(activeMinos[0].length*blockDimension))) {
                startBlockX = startBlockX -(blockDimension*3)
                activeMinos = rotate(activeMinos);
            }else if ((activeMinos.length === 3) && (startBlockX===(canvas.width/2)+((blocksX*blockDimension)/2)-(activeMinos[0].length*blockDimension))) {
                startBlockX = startBlockX -blockDimension
                activeMinos = rotate(activeMinos);
            }else if (((offset + 90 < blocksY * blockDimension - activeMinos.length*blockDimension))
                || ((activeMinos.length === 3) && (offset + 60 < blocksY * blockDimension - activeMinos.length*blockDimension))
                || ((activeMinos.length === 2) && (offset + 30 < blocksY * blockDimension - activeMinos.length*blockDimension))){
                activeMinos = rotate(activeMinos);
            }
            break

    }
});

// Prepare some start variables
function initGame()
{
    mazeState = Array(blocksY).fill().map(() => Array(blocksX).fill({ filled: 0, color: "" }));
    console.log(mazeState)
    game()
    let playButton = document.getElementById('startButton');
    playButton.addEventListener('click', function() {
        // Reset mazeState
        mazeState = Array(blocksY).fill().map(() => Array(blocksX).fill({ filled: 0, color: "" }));
        // Reset game variables
        gameOver = false;
        gameStarted = true;
        gameOverSoundPlayed = false;
        offset=0;
        score = 35;
        backgroundSound.play();
    });

}

function game() {
    let params = new URLSearchParams(window.location.search);
    let username = params.get('username');

    window.requestAnimationFrame(game)
    document.getElementById("score").innerHTML = "Score: " + score;

    let highscoreData = JSON.parse(localStorage.getItem("highscore_data"))
    if (highscoreData === null) {
        document.getElementById("highscore").innerHTML = "Noch kein Highscore vorhanden.";
    } else {
        document.getElementById("highscore").innerHTML = "Highscore von " + highscoreData.username + ": " + highscoreData.highscore;
    }

    context.reset()

    hintergrund()

    frameCount++

    debug()

    console.log(username)

    for (let i = 0; i < blocksX; i++) {
        if (mazeState[1][i].filled === 1) {
            // document.getElementById("broken-screen").style.display = "block"
            // document.getElementById("restartButton").addEventListener("click", function() {
            //     window.location.href = 'name.html';
            // });
            // document.getElementById('logo-tetris').style.display = 'none';
            //
            // // Prüfen und speichern des Highscores
            // // document.getElementById("loose").style.display = "block";
            // gameOverOverlay.style.display = 'flex';
            // document.getElementById("username").innerHTML = "";
            gameOver = true;
            backgroundSound.pause();
            backgroundSound.currentTime = 0;
            break;
        } else {
            document.getElementById("username").innerHTML = username;
        }
    }
    // if (gameOver) {
    //     if (score>highscore){
    //         highscore = { username: username, highscore: score };
    //         localStorage.setItem("highscore", JSON.stringify(score));
    //     }
    //     if (!gameOverSoundPlayed) {
    //          gameOverSound.play();
    //         gameOverSoundPlayed = true;
    //     }
    // }
// if (gameOver){
//     let highscoreData = JSON.parse(localStorage.getItem("highscore_data"))
//     if  (gameOver && score <= highscoreData.highscore) {
//         document.getElementById("broken-screen").style.display = "block"
//         document.getElementById("restartButton").addEventListener("click", function () {
//             window.location.href = 'name.html';
//         });
//         document.getElementById('logo-tetris').style.display = 'none';
//         gameOverOverlay.style.display = 'flex';
//         document.getElementById("username").innerHTML = "";
//         if (!gameOverSoundPlayed) {
//             gameOverSound.play();
//             gameOverSoundPlayed = true;
//         }
//
//     } else if  (gameOver && highscoreData === null || gameOver && score > highscoreData.highscore) {
//         // gameOverSound.play();
//         // gameOverSoundPlayed = true;
//         // if(highscoreData === null || score > highscoreData.highscore) {
//         highscoreData = {username: username, highscore: score};
//         localStorage.setItem("highscore_data", JSON.stringify(highscoreData));
//         backgroundSound.pause()
//         backgroundSound.currentTime = 0;
//         document.getElementById("broken-screen").style.display = "block"
//         document.getElementById("restartButton").addEventListener("click", function () {
//             window.location.href = 'name.html';
//         });
//         document.getElementById('logo-tetris').style.display = 'none';
//         document.getElementById("new-highscore").innerHTML = "Neuen Highscore erreicht!: " + highscoreData.highscore;
//         document.getElementById('new-highscore').style.display = "flex";
//         document.getElementById("konfetti").style.display = "flex";
//         if (!crowdCheerSoundPlayed) {
//             crowdCheer.play()
//             crowdCheerSoundPlayed = true
//         }
//     }
// }


    if (gameOver){
        let highscoreData = JSON.parse(localStorage.getItem("highscore_data"))
        if  (highscoreData === null || score > highscoreData.highscore) {
            highscoreData = {username: username, highscore: score};
            localStorage.setItem("highscore_data", JSON.stringify(highscoreData));
            document.getElementById("broken-screen").style.display = "none";
            backgroundSound.pause()
            backgroundSound.currentTime = 0;
            // document.getElementById("broken-screen").style.display = "none"
            document.getElementById("restartButton").addEventListener("click", function () {
                window.location.href = 'name.html';
            });
            document.getElementById('logo-tetris').style.display = 'none';
            document.getElementById("new-highscore").innerHTML = "Neuen Highscore erreicht!: " + highscoreData.highscore;
            document.getElementById('new-highscore').style.display = "flex";
            // document.getElementById("konfetti").style.display = "flex";
            gameOverOverlay.style.display = 'none';
            document.getElementById("feuer-gif").style.display = "none";
            document.getElementById("game-over-text").style.display = "none";
            document.getElementById("game-over-alien").style.display = "none";
            document.getElementById("pepe-dance").style.display = "none";
            document.getElementById("firework").style.display = "flex";
            if (!crowdCheerSoundPlayed) {
                crowdCheer.play()
                crowdCheerSoundPlayed = true
            }
            gameOverSoundPlayed = true

        } else if (score <= highscoreData.highscore) {
            document.getElementById("broken-screen").style.display = "block"
            document.getElementById("restartButton").addEventListener("click", function () {
                window.location.href = 'name.html';
            });
            document.getElementById('logo-tetris').style.display = 'none';
            gameOverOverlay.style.display = 'flex';
            document.getElementById("username").innerHTML = "";
            if (!gameOverSoundPlayed) {
                gameOverSound.play();
                gameOverSoundPlayed = true;
            }

        }
    }

            // if (gameOverSoundPlayed){
            //     gameOverSound.pause()
            //     gameOverSound.currentTime=0
            // }
            // // Prüfen und speichern des Highscores
            // let highscoreData = JSON.parse(localStorage.getItem("highscore_data"))
            // if(highscoreData === null || score > highscoreData.highscore) {
            //     highscoreData = { username: username, highscore: score };
            //     localStorage.setItem("highscore_data", JSON.stringify(highscoreData));
            // }
    // }

    if (gameStarted) {
        if (activeMinos === 0 && !gameOver) {
            chosenTetrominos = generateTetromino();
            activeMinos = chosenTetrominos.shape;
            activeColor = colors[chosenTetrominos.name];
            startBlockX = (canvas.width/2)-(blockDimension*2)
            startBlockY = (canvas.height/2)-((blocksY*blockDimension)/2)
            offset = 0
        }
        drawNextTetromino();
    }

    minosPosition = {
        x: (startBlockX - ((canvas.width/2)-(blocksX*blockDimension)/2)) / blockDimension,
        y: ((startBlockY + offset) - ((canvas.height/2)-(blocksY*blockDimension)/2)) / blockDimension
    }

// Überprüfe, ob der nächste Block auf einen vorhandenen Block fallen wird
    let canPlaceNextMinos = true;
    for(let i = 0; i < activeMinos.length; i++) {
        for (let j = 0; j < activeMinos[i].length; j++) {
            if (activeMinos[i][j] === 1 && mazeState[minosPosition.y + i + 1] && mazeState[minosPosition.y + i + 1][minosPosition.x + j].filled === 1) {
                canPlaceNextMinos = false;
                break;
            }
        }
    }

    if(!canPlaceNextMinos || offset === blocksY * blockDimension - activeMinos.length*blockDimension) {
        for (let i = 0; i < activeMinos.length; i++) {
            for (let j = 0; j < activeMinos[i].length; j++) {
                if (activeMinos[i][j] === 1) {
                    mazeState[minosPosition.y + i][minosPosition.x + j] = {filled: 1, color: activeColor};
                }
            }
        }

        console.log(minosPosition)
        console.log(activeMinos)
        activeMinos = 0

        function isRowFull(row) {
            return row.every(cell => cell.filled === 1);
        }

        function removeFullRows() {
            let originalRows = mazeState.length;
            let incompleteRows = mazeState.filter(row => !isRowFull(row));
            let numberOfRowsToAdd = originalRows - incompleteRows.length;
            if (numberOfRowsToAdd > 0) {
                clearSound.play();
                score += numberOfRowsToAdd
                for (let i = 0; i < numberOfRowsToAdd; i++) {
                    incompleteRows.unshift(Array(blocksX).fill({ filled: 0, color: "" }));
                }
            }
            mazeState = incompleteRows;
        }
        removeFullRows();
    }else {
        drawBlock(startBlockX, startBlockY + offset, activeMinos)

    }
}

function hintergrund() {
    context.strokeStyle = 'grey'

    let mazeStartX = (canvas.width/2)-(blocksX*blockDimension)/2
    let mazeStartY = (canvas.height/2) - (blocksY*blockDimension)/2

    // context.fillRect(mazeStartX, mazeStartY, blocksX*blockDimension, blocksY*blockDimension)

    // Zeichne 20 horizontale Linien
    for(let i = 0; i <= 20; i++) {
        let y = (canvas.height/2)-(blocksY*blockDimension)/2 + i*blockDimension;
        context.beginPath();
        context.moveTo((canvas.width/2)-(blocksX*blockDimension)/2, y);
        context.lineTo((canvas.width/2)+(blocksX*blockDimension)/2, y);
        context.stroke();
    }

    // Zeichne 10 vertikale Linien
    for(let j = 0; j <= 10; j++) {
        let x = (canvas.width/2)-(blocksX*blockDimension)/2 + j*blockDimension;
        context.beginPath();
        context.moveTo(x, (canvas.height/2)-(blocksY*blockDimension)/2);
        context.lineTo(x, (canvas.height/2)+(blocksY*blockDimension)/2);
        context.stroke();
    }

    for(let i = 0; i < blocksY; i++) {
        for(let j = 0; j < blocksX; j++) {

            if (mazeState[i][j].filled === 1) {
                context.fillStyle = mazeState[i][j].color;
                context.roundRect(mazeStartX+(j * blockDimension), mazeStartY + (i * blockDimension), blockDimension, blockDimension, 5).fill();

                // Add a white border around the block
                context.strokeStyle = 'white';
                context.lineWidth = 2;
                context.roundRect(mazeStartX+(j * blockDimension), mazeStartY + (i * blockDimension), blockDimension, blockDimension, 5).stroke();
            }
        }
    }
}

function drawBlock(x, y, block) {
    for(let i = 0; i < block.length; i++) {
        for(let j = 0; j < block[i].length; j++) {
            if(block[i][j] === 1) {

                context.fillStyle = activeColor;
                context.roundRect(x + j*blockDimension, y + i*blockDimension, blockDimension, blockDimension, 5).fill();

                context.strokeStyle = 'white';
                context.lineWidth = 2;
                context.roundRect(x + j*blockDimension, y + i*blockDimension, blockDimension, blockDimension, 5).stroke();

            }
        }
    }
}

function generateTetromino() { // Pasul 2
    if (nextTetromino === null) {
        nextTetromino = array[Math.floor(Math.random() * array.length)];
    }
    let currentTetromino = nextTetromino;
    nextTetromino = array[Math.floor(Math.random() * array.length)];
    return currentTetromino;
}

function drawNextTetromino() { // Pasul 3
    let x = (canvas.width/2)+(canvas.width/4); // Coordonatele unde vrei să desenezi următorul tetromino
    let y = 50;
    for(let i = 0; i < nextTetromino.shape.length; i++) {
        for(let j = 0; j < nextTetromino.shape[i].length; j++) {
            if(nextTetromino.shape[i][j] === 1) {
                context.fillStyle = colors[nextTetromino.name];
                context.roundRect(x + j*blockDimension, y + i*blockDimension, blockDimension, blockDimension, 5).fill();
                context.strokeStyle = 'white';
                context.lineWidth = 2;
                context.roundRect(x + j*blockDimension, y + i*blockDimension, blockDimension, blockDimension, 5).stroke();
            }
        }
    }
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x+r, y);
    this.arcTo(x+w, y,   x+w, y+h, r);
    this.arcTo(x+w, y+h, x,   y+h, r);
    this.arcTo(x,   y+h, x,   y,   r);
    this.arcTo(x,   y,   x+w, y,   r);
    this.closePath();
    return this;
}

// Füge diese Drehfunktion oben in die Datei ein
// function rotate(tetrominos) {
//     return tetrominos[0].map((val, index) => tetrominos.map(row => row[index])).reverse();
// }

// Füge diese Drehfunktion oben in die Datei ein
function rotate(tetrominos) {
    // Erstellen Sie ein leeres Array, um das neue rotierte Array zu speichern
    let rotatedTetrominos = [];

    // Durchlaufen Sie jede Spalte im ursprünglichen Array
    for (let i = 0; i < tetrominos[0].length; i++) {
        // Erstellen Sie ein leeres Array, um die neue Zeile zu speichern
        let newRow = [];

        // Durchlaufen Sie jede Zeile im ursprünglichen Array
        for (let row = 0; row < tetrominos.length; row++) {
            // Fügen Sie das Element an der aktuellen Position zur neuen Zeile hinzu
            newRow.push(tetrominos[row][i]);
        }

        // Fügen Sie die neue Zeile zum rotierten Array hinzu
        rotatedTetrominos.push(newRow);
    }

    // Kehren Sie die Reihenfolge der Zeilen um, um eine 90-Grad-Drehung zu erreichen
    rotatedTetrominos = rotatedTetrominos.reverse();

    // Geben Sie das rotierte Array zurück
    return rotatedTetrominos;
}

function debug() {
    let currentTime = Date.now();
    if (currentTime - lastTime >= 1000) { // wenn eine Sekunde vergangen ist
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        offset+= 30;

    }

    // Zeige die FPS an
    context.fillStyle = 'white'
    context.fillText('FPS: ' + fps, 10, 30);

    // Zeige die Framezahl an

    context.fillText('Frame: ' + frameCount, 10, 10)
}
initGame()

