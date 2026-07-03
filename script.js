const WIDTH = 256;
const HEIGHT = 144;
const SCALE = 5 / WIDTH;
const A_OFFSET = -0.3 - WIDTH * SCALE/2;
const B_OFFSET = HEIGHT * SCALE/2;
const ITER = 256;

// 30 colors going around the edges of the RGB cube + black
const PALLETE = [[0, 0, 255], [0, 95, 255], [0, 135, 255], [0, 175, 255], [0, 215, 255], [0, 255, 255], [0, 255, 215], [0, 255, 175], [0, 255, 135], [0, 255, 95], [0, 255, 0], [95, 255, 0], [135, 255, 0], [175, 255, 0], [215, 255, 0], [255, 255, 0], [255, 215, 0], [255, 175, 0], [255, 135, 0], [255, 95, 0], [255, 0, 0], [255, 0, 95], [255, 0, 135], [255, 0, 175], [255, 0, 215], [255, 0, 255], [215, 0, 255], [175, 0, 255], [135, 0, 255], [95, 0, 255], [0, 0, 0]];

const canvas = document.getElementById("asciibrot");
const ctx = canvas.getContext("2d");
const buffer = document.createElement("canvas");
const bufferCtx = buffer.getContext("2d");
const pixels = bufferCtx.createImageData(WIDTH, HEIGHT);
buffer.width = WIDTH;
buffer.height = HEIGHT;
ctx.imageSmoothingEnabled = false;

function resizeCanvas() {
    let scale = Math.min(window.innerWidth/buffer.width, window.innerWidth/buffer.height);
    canvas.width = buffer.width * scale;
    canvas.height = buffer.height * scale;
    ctx.imageSmoothingEnabled = false;
}

window.addEventListener('resize', resizeCanvas);

function mandelbrot(x, y) {
    let a = 0;
    let b = 0;
    for (let t = 0; t < ITER; t++) {
        let a2 = a*a;
        let b2 = b*b;
        if (a2 + b2 > 4) return t % 30; // color
        let old_a = a;
        a = a2 - b2 + x;
        b = 2 * old_a * b + y;
    }
    return 30; // black
}

function render(array, width, height) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let index = (y*width+x)*4;
            let a = x*SCALE + A_OFFSET;
            let b = B_OFFSET - y*SCALE;

            let t = mandelbrot(a, b);
            array[index]   = PALLETE[t][0]; // red
            array[index+1] = PALLETE[t][1]; // green
            array[index+2] = PALLETE[t][2]; // blue
            array[index+3] = 255;
        }
    }
   
}

var previousOffset = 0;
function updateFrame(offset) {
    requestAnimationFrame(updateFrame);
    
    // throtle
    // if (offset - previousOffset < 16) return;
    // previousOffset = offset;
    
    render(pixels.data, buffer.width, buffer.height); 
    bufferCtx.putImageData(pixels, 0, 0);
    ctx.drawImage(buffer, 
        0, 0, buffer.width, buffer.height,
        0, 0, canvas.width, canvas.height
    );
}

resizeCanvas();
requestAnimationFrame(updateFrame);
