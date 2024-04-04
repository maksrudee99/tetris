const canvas = document.getElementById('canvas')
document.body.style.backgroundColor = 'black'


let lastTime = Date.now();
let fps = 0;

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let offset = 0
let frameCount = 0

let blocksX = 10
let blocksY = 20
let blockDimension = 30

let activeMinos = 0
let activeColor = ""

let mazeState = []

let I = [
    [1, 1, 1, 1]
];

let J = [
    [1, 0, 0],
    [1, 1, 1]
];

let L = [
    [0, 0, 1],
    [1, 1, 1]
];

let O = [
    [1, 1],
    [1, 1]
];

let S = [
    [0, 1, 1],
    [1, 1, 0]
];

let T = [
    [0, 1, 0],
    [1, 1, 1]
];

let Z = [
    [1, 1, 0],
    [0, 1, 1],
];

const array = [I, J, L, O, S, T, Z];

let randomColor

let startBlockX = (canvas.width/2)-60
let startBlockY = (canvas.height/2)-((blocksY*blockDimension)/2)

const context = canvas.getContext('2d')

// Adăugați această funcție de rotație în partea de sus a fișierului
// function rotate(tetrominos) {
//     return tetrominos[0].map((val, index) => tetrominos.map(row => row[index])).reverse();
// }
function rotate(tetrominos) {
    // Creăm un array gol pentru a stoca noua matrice rotită
    let rotatedTetrominos = [];

    // Parcurgem fiecare coloană din matricea originală
    for (let i = 0; i < tetrominos[0].length; i++) {
        // Creăm un array gol pentru a stoca noul rând
        let newRow = [];

        // Parcurgem fiecare rând din matricea originală
        for (let row = 0; row < tetrominos.length; row++) {
            // Adăugăm elementul de la poziția curentă la noul rând
            newRow.push(tetrominos[row][i]);
        }

        // Adăugăm noul rând la matricea rotită
        rotatedTetrominos.push(newRow);
    }

    // Inversăm ordinea rândurilor pentru a realiza rotația cu 90 de grade
    rotatedTetrominos = rotatedTetrominos.reverse();

    // Returnăm matricea rotită
    return rotatedTetrominos;
}
addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'ArrowLeft':
            if ((startBlockX>(canvas.width/2)-(blocksX*blockDimension)/2) && offset<blocksY*blockDimension-31){
                startBlockX-=30
            }
            break
        case 'ArrowRight':
            if ((startBlockX<(canvas.width/2)+((blocksX*blockDimension)/2)-(activeMinos[0].length*blockDimension)) && offset<blocksY*blockDimension-31){
                startBlockX+=30
            }
            break
        case 'ArrowUp':
            activeMinos = rotate(activeMinos);
            break
    }
});

// Prepare some start variables
function initGame()
{
    mazeState = Array(blocksY).fill().map(() => Array(blocksX).fill({ filled: 0, color: "" }));

    console.log(mazeState)

    game()
}

// game loop
function game()
{
    window.requestAnimationFrame(game)

    context.reset()

    hintergrund()

    frameCount++

    debug()

    if (activeMinos === 0) {
        activeMinos = array[Math.floor(Math.random() * array.length)];
        activeColor= "#" + Math.floor(Math.random() * 16777215).toString(16);
        startBlockX = (canvas.width/2)-60
        startBlockY = (canvas.height/2)-((blocksY*blockDimension)/2)
        offset = 0
    }

    let minosPosition = {
        x: (startBlockX - ((canvas.width/2)-(blocksX*blockDimension)/2)) / blockDimension,
        y: ((startBlockY + offset) - ((canvas.height/2)-(blocksY*blockDimension)/2)) / blockDimension
    }

// Verificăm dacă următorul bloc va cădea pe un bloc existent
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
        for(let i = 0; i < activeMinos.length; i++) {
            for (let j = 0; j < activeMinos[i].length; j++) {
                if (activeMinos[i][j] === 1) {
                    mazeState[minosPosition.y + i][minosPosition.x + j] = { filled: 1, color: activeColor };
                }
            }
        }

        console.log(minosPosition)
        console.log(activeMinos)

        activeMinos = 0
    } else {
        drawBlock(startBlockX, startBlockY + offset, activeMinos)

        offset+=1
    }
}

function hintergrund() {
    context.strokeStyle = 'grey'

    let mazeStartX = (canvas.width/2)-(blocksX*blockDimension)/2
    let mazeStartY = (canvas.height/2) - (blocksY*blockDimension)/2

    // Desenarea a 20 linii orizontale
    for(let i = 0; i <= 20; i++) {
        let y = (canvas.height/2)-(blocksY*blockDimension)/2 + i*blockDimension;
        context.beginPath();
        context.moveTo((canvas.width/2)-(blocksX*blockDimension)/2, y);
        context.lineTo((canvas.width/2)+(blocksX*blockDimension)/2, y);
        context.stroke();
    }

    // Desenarea a 10 linii verticale
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
                context.fillRect(mazeStartX+(j * blockDimension), mazeStartY + (i * blockDimension), blockDimension, blockDimension);
            }
        }
    }
}
function drawBlock(x, y, block) {
    for(let i = 0; i < block.length; i++) {
        for(let j = 0; j < block[i].length; j++) {
            if(block[i][j] === 1) {
                context.fillStyle = activeColor;
                context.fillRect(x + j*blockDimension, y + i*blockDimension, blockDimension, blockDimension);

            }
        }
    }
}
function debug() {
    let currentTime = Date.now();
    if (currentTime - lastTime >= 1000) { // wenn eine Sekunde vergangen ist
        fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
    }

    context.fillStyle = 'black'
    context.fillText('FPS: ' + fps, 10, 30);


    context.fillText('Frame: ' + frameCount, 10, 10)
}
initGame()