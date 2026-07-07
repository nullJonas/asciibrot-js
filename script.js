// visualization parameters
const WIDTH = 256;
const HEIGHT = 144;
const ITER = 256;
const SCALE = 5 / WIDTH;
const A_OFFSET = -0.3 - WIDTH * SCALE/2;
const B_OFFSET = HEIGHT * SCALE/2;
const LOW_SPEED = 0.02;
const HIGH_SPEED = 0.08;
const SLOW_ZOOM_IN = 0.98;
const SLOW_ZOOM_OUT = 1.02;
const SLOW_SIN = 0.010417;
const SLOW_COS = 0.999946;
const FAST_ZOOM_IN = 0.93;
const FAST_ZOOM_OUT = 1.075;
const FAST_SIN = 0.041667;
const FAST_COS = 0.999132;

// 120 colors going around the edges of the RGB cube + black
const PALLETE = [[0, 0, 255], [0, 23, 255], [0, 47, 255], [0, 71, 255], [0, 95, 255], [0, 105, 255], [0, 115, 255], [0, 125, 255], [0, 135, 255], [0, 145, 255], [0, 155, 255], [0, 165, 255], [0, 175, 255], [0, 185, 255], [0, 195, 255], [0, 205, 255], [0, 215, 255], [0, 225, 255], [0, 235, 255], [0, 245, 255], [0, 255, 255], [0, 255, 245], [0, 255, 235], [0, 255, 225], [0, 255, 215], [0, 255, 205], [0, 255, 195], [0, 255, 185], [0, 255, 175], [0, 255, 165], [0, 255, 155], [0, 255, 145], [0, 255, 135], [0, 255, 125], [0, 255, 115], [0, 255, 105], [0, 255, 95], [0, 255, 71], [0, 255, 47], [0, 255, 23], [0, 255, 0], [23, 255, 0], [47, 255, 0], [71, 255, 0], [95, 255, 0], [105, 255, 0], [115, 255, 0], [125, 255, 0], [135, 255, 0], [145, 255, 0], [155, 255, 0], [165, 255, 0], [175, 255, 0], [185, 255, 0], [195, 255, 0], [205, 255, 0], [215, 255, 0], [225, 255, 0], [235, 255, 0], [245, 255, 0], [255, 255, 0], [255, 245, 0], [255, 235, 0], [255, 225, 0], [255, 215, 0], [255, 205, 0], [255, 195, 0], [255, 185, 0], [255, 175, 0], [255, 165, 0], [255, 155, 0], [255, 145, 0], [255, 135, 0], [255, 125, 0], [255, 115, 0], [255, 105, 0], [255, 95, 0], [255, 71, 0], [255, 47, 0], [255, 23, 0], [255, 0, 0], [255, 0, 23], [255, 0, 47], [255, 0, 71], [255, 0, 95], [255, 0, 105], [255, 0, 115], [255, 0, 125], [255, 0, 135], [255, 0, 145], [255, 0, 155], [255, 0, 165], [255, 0, 175], [255, 0, 185], [255, 0, 195], [255, 0, 205], [255, 0, 215], [255, 0, 225], [255, 0, 235], [255, 0, 245], [255, 0, 255], [245, 0, 255], [235, 0, 255], [225, 0, 255], [215, 0, 255], [205, 0, 255], [195, 0, 255], [185, 0, 255], [175, 0, 255], [165, 0, 255], [155, 0, 255], [145, 0, 255], [135, 0, 255], [125, 0, 255], [115, 0, 255], [105, 0, 255], [95, 0, 255], [71, 0, 255], [47, 0, 255], [23, 0, 255], [0, 0, 0]]

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
        if (a2 + b2 > 4) return t % 120; // color
        let old_a = a;
        a = a2 - b2 + x;
        b = 2 * old_a * b + y;
    }
    return 120; // black
}

const keysHeld = {};
addEventListener("keydown", (event) => {keysHeld[event.code] = true;});
addEventListener("keyup", (event) => {keysHeld[event.code] = false;});

function render(array, width, height, zoom, rposx, rposy) {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let a = x*SCALE + A_OFFSET;
            let b = B_OFFSET - y*SCALE;

            a *= zoom;
            b *= zoom;

            [a, b] = [
                a*cos_angle - b*sin_angle + rposx,
                b*cos_angle + a*sin_angle + rposy
            ];

            let t = mandelbrot(a, b);
            let index = (y*width+x)*4;
            array[index]   = PALLETE[t][0]; // red
            array[index+1] = PALLETE[t][1]; // green
            array[index+2] = PALLETE[t][2]; // blue
            array[index+3] = 255;
        }
    }
   
}

function handleInputs() {
    if (keysHeld["ShiftLeft"] || keysHeld["ShiftRight"]) {
        var increment = HIGH_SPEED * zoom;
        var zoom_in = FAST_ZOOM_IN;
        var zoom_out = FAST_ZOOM_OUT;
        var sin_inc = FAST_SIN;
        var cos_inc = FAST_COS;
    } else {
        var increment = LOW_SPEED * zoom;
        var zoom_in = SLOW_ZOOM_IN;
        var zoom_out = SLOW_ZOOM_OUT;
        var sin_inc = SLOW_SIN;
        var cos_inc = SLOW_COS;
    }

    if (keysHeld["KeyI"]) zoom *= zoom_in;
    if (keysHeld["KeyO"]) zoom *= zoom_out;
    if (keysHeld["KeyW"] || keysHeld["ArrowUp"]) {
        rposx -= increment * sin_angle;
        rposy += increment * cos_angle;
    }
    if (keysHeld["KeyA"] || keysHeld["ArrowRight"]) {
        rposx -= increment * cos_angle;
        rposy -= increment * sin_angle;
    }
    if (keysHeld["KeyS"] || keysHeld["ArrowDown"]) {
        rposx += increment * sin_angle;
        rposy -= increment * cos_angle;
    }
    if (keysHeld["KeyD"] || keysHeld["ArrowLeft"]) {
        rposx += increment * cos_angle;
        rposy += increment * sin_angle;
    }
    if (keysHeld["KeyQ"]) {
        [sin_angle, cos_angle] = [
            sin_angle*cos_inc + cos_angle*sin_inc,
            cos_angle*cos_inc - sin_angle*sin_inc
        ];
    }
    if (keysHeld["KeyE"]) {
        [sin_angle, cos_angle] = [
            sin_angle*cos_inc - cos_angle*sin_inc,
            cos_angle*cos_inc + sin_angle*sin_inc

        ];
    }
}

var zoom = 1;
var rposx = 0;
var rposy = 0;
var sin_angle = 0;
var cos_angle = 1;
function updateFrame(offset) {
    requestAnimationFrame(updateFrame);
    
    handleInputs();
    render(pixels.data, buffer.width, buffer.height, zoom, rposx, rposy); 
    bufferCtx.putImageData(pixels, 0, 0);
    ctx.drawImage(buffer, 
        0, 0, buffer.width, buffer.height,
        0, 0, canvas.width, canvas.height
    );
}

resizeCanvas();
requestAnimationFrame(updateFrame);
