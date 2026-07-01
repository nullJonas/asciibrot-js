const canvas = document.getElementById("asciibrot");
const ctx = canvas.getContext("2d");
var imageData = ctx.createImageData(canvas.width, canvas.height);
var data = imageData.data

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    imageData = ctx.createImageData(canvas.width, canvas.height);
    data = imageData.data;
}

window.addEventListener('resize', resizeCanvas);

function updateFrame(offset) {
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let index = (y*canvas.width+x)*4;
            data[index] = ((x+y)/2+offset/8)%256;
            data[index+1] = ((2*x+y)/3+offset/12)%256;
            data[index+2] = ((x+2*y)/3+offset/16)%256;
            data[index+3] = 255;
        } 
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(updateFrame);
}

resizeCanvas();
requestAnimationFrame(updateFrame);
