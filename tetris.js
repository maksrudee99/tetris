const canvas = document.getElementById('canvas')

let lastTime = Date.now();
let fps = 0;


canvas.width = window.innerWidth
canvas.height = window.innerHeight

let offset = 0
let offset2 = 0
let frameCount = 0

let blockX = 10
let blockY = 20
let blockDimension = 40

let I = [
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

let J = [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
];

let L = [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
];

let O = [
    [1, 1],
    [1, 1]
];

let S = [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
];

let T = [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
];

let Z = [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
];

let startBlockX = (canvas.width/2)-(blockX*blockDimension)/2
let startBlockY = (canvas.height/2)-(blockY*blockDimension)/2

const context = canvas.getContext('2d')
addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'a':
            startBlockX-=40
            break
        case 'd':
            startBlockX+=40
            break
    }
});
function game()
{
    window.requestAnimationFrame(game)


    context.reset()

    hintergrund()

    frameCount++

    debug()

    if(offset>blockY*blockDimension-41){
        drawBlock(startBlockX, startBlockY, I)
    }else{
        drawBlock(startBlockX, startBlockY, I)

        offset+=1
    }

}

function hintergrund() {
    context.strokeStyle = 'grey'

    // Desenarea a 20 linii orizontale
    for(let i = 0; i <= 20; i++) {
        let y = (canvas.height/2)-(blockY*blockDimension)/2 + i*blockDimension;
        context.beginPath();
        context.moveTo((canvas.width/2)-(blockX*blockDimension)/2, y);
        context.lineTo((canvas.width/2)+(blockX*blockDimension)/2, y);
        context.stroke();
    }

    // Desenarea a 10 linii verticale
    for(let j = 0; j <= 10; j++) {
        let x = (canvas.width/2)-(blockX*blockDimension)/2 + j*blockDimension;
        context.beginPath();
        context.moveTo(x, (canvas.height/2)-(blockY*blockDimension)/2);
        context.lineTo(x, (canvas.height/2)+(blockY*blockDimension)/2);
        context.stroke();
    }
}
function drawBlock(x, y, block) {
    for(let i = 0; i < block.length; i++) {
        for(let j = 0; j < block[i].length; j++) {
            if(block[i][j] === 1) {
                context.fillRect(x + j*blockDimension, y + i*blockDimension + offset, blockDimension, blockDimension);

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
// function rectangle() {
//     context.fillStyle = 'blue'
//     context.strokeStyle = 'green'
//     context.fillRect((canvas.width/2)-(blockX*blockDimension)/2, (canvas.height/2)-(blockY*blockDimension)/2+offset,80,80)
//     context.strokeRect((canvas.width/2)-(blockX*blockDimension)/2, (canvas.height/2)-(blockY*blockDimension)/2+offset,80,80)
// }
// function linie() {
//     context.fillStyle = 'green'
//     context.fillRect((canvas.width/2)-(blockX*blockDimension)/2+160, (canvas.height/2)-(blockY*blockDimension)/2+offset2,160,40)
// }

game()