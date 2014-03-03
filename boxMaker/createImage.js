var canvas = document.getElementById('canvas');
drawCanvas(canvas);

    // height is 0 to 255, littleEndian is a bool
function encodeHeight(height, littleEndian) {
    if (littleEndian) {
    return  (255   << 24) |    // alpha
            (value << 16) |    // blue
            (value <<  8) |    // green
            value;            // red
    } 
    else {
    return  (value << 24) |    // red
            (value << 16) |    // green
            (value <<  8) |    // blue
             255;              // alpha
    }
}

function drawCanvas(canvas) {

    var canvasWidth  = canvas.width;
    var canvasHeight = canvas.height;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        
    var buf = new ArrayBuffer(imageData.data.length);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);
            
    // Determine whether Uint32 is little- or big-endian.
    data[1] = 0x0a0b0c0d;
    var isLittleEndian = true;
    if (buf[4] === 0x0a && buf[5] === 0x0b && buf[6] === 0x0c &&
        buf[7] === 0x0d) {
        isLittleEndian = false;
    }

    for (var y = 0; y < canvasHeight; ++y) {
        for (var x = 0; x < canvasWidth; ++x) {
            var value = x * y & 0xff;
            data[y * canvasWidth + x] = encodeHeight(value, isLittleEndian);
        }
    }

    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
}
