const canvas = document.getElementById('canvas')

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

let startBlockX = (canvas.width/2)-60
let startBlockY = (canvas.height/2)-((blocksY*blockDimension)/2)

const context = canvas.getContext('2d')
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
    }
});

// Prepare some start variables
function initGame()
{
    mazeState = Array(blocksY).fill().map(() => Array(blocksX).fill(0));

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
        offset = 0
    }

    if(offset<blocksY*blockDimension-activeMinos.length*blockDimension) {
        drawBlock(startBlockX, startBlockY + offset, activeMinos)

        offset+=1
    }else if (offset === blocksY * blockDimension - activeMinos.length*blockDimension){

        let minosPosition = {
            x: (startBlockX - ((canvas.width/2)-(blocksX*blockDimension)/2)) / blockDimension,
            y: ((startBlockY + offset) - ((canvas.height/2)-(blocksY*blockDimension)/2)) / blockDimension
        }

        console.log(minosPosition)
        console.log(activeMinos)

        for(let i = 0; i < activeMinos.length; i++) {
            for (let j = 0; j < activeMinos[i].length; j++) {
                if (activeMinos[i][j] === 1) {
                    mazeState[minosPosition.y + i][minosPosition.x + j] = 1
                }
            }
        }

        activeMinos = 0
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
            if (mazeState[i][j] === 1) {
                context.fillStyle = 'grey'
                context.fillRect(mazeStartX+(j * blockDimension), mazeStartY + (i * blockDimension), blockDimension, blockDimension);
            }
        }
    }
}
function drawBlock(x, y, block) {
    for(let i = 0; i < block.length; i++) {
        for(let j = 0; j < block[i].length; j++) {
            if(block[i][j] === 1) {
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