const canvas = document.getElementById("asciibrot");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const buffer = document.createElement("canvas");
const bufferCtx = buffer.getContext("2d");
buffer.width = 160;
buffer.height = 90;
const pixels = bufferCtx.createImageData(buffer.width, buffer.height);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
}

window.addEventListener('resize', resizeCanvas);

var previousOffset = 0;
function updateFrame(offset) {
    requestAnimationFrame(updateFrame);
    
    // throtle
    // if (offset - previousOffset < 16) return;
    // previousOffset = offset;
    
    for (let y = 0; y < buffer.height; y++) {
        for (let x = 0; x < buffer.width; x++) {
            let index = (y*buffer.width + x)*4;
            pixels.data[index] = ((4*x+4*y)+offset/8)%256;
            pixels.data[index+1] = ((8*x+4*y)+offset/12)%256;
            pixels.data[index+2] = ((4*x+8*y)+offset/16)%256;
            pixels.data[index+3] = 255;
        } 
    }

    bufferCtx.putImageData(pixels, 0, 0);
    ctx.drawImage(buffer, 
        0, 0, buffer.width, buffer.height,
        0, 0, canvas.width, canvas.height
    );
}

resizeCanvas();
requestAnimationFrame(updateFrame);
