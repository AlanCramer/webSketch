

function AcGrey8Image(width, height) {

    AcGreyImage.call(this, width, height);

    this.databuffer = new ArrayBuffer(width*height);
    this.data = new Uint8ClampedArray(this.databuffer);
}
AcGrey8Image.prototype = Object.create(AcGreyImage.prototype);
AcGrey8Image.prototype.constructor = AcGreyImage;

function AcGrey16Image(width, height) {

    AcGreyImage.call(this, width, height);

    this.databuffer = new ArrayBuffer(width*height);
    this.data = new Uint16Array(this.databuffer);
}
AcGrey8Image.prototype = Object.create(AcGreyImage.prototype);
AcGrey8Image.prototype.constructor = AcGreyImage;


// abstract base class - todo, how to enforce?
function AcGreyImage(width, height) {

// private:
    this.width = width;
    this.height = height;
    // this.databuffer = new ArrayBuffer(width*height);
    // this.data = new Uint8ClampedArray(this.databuffer);
        
}

// public:    
AcGreyImage.prototype.getAt = function(x,y) {
    return this.data[this.width*y + x];
}
    
AcGreyImage.prototype.debugPrint = function() {

    console.log("Width, Height: " + this.width + ", " + this.height); 
    var msg = "";
    var pad = "000";
                            
    for (var y = 0; y < this.height; ++y) {
        for (var x = 0; x < this.width; ++x) {
            var value = this.getAt(x,y);        
            var result = (pad+value.toString()).slice(-pad.length);
           
            msg = msg + result + " ";
        }
        msg = msg + "\n";
    }
    console.log(msg);
}

AcGreyImage.prototype.initFromCanvas = function(canvas) {
    var ctx = canvas.getContext('2d'); // todo error checking

    this.width  = canvas.width;
    this.height = canvas.height;
    
    var imageData = ctx.getImageData(0, 0, this.width, this.height);

    var buf = imageData.data;
    //var buf = new ArrayBuffer(imageData.data.length);
    var buf8 = new Uint8ClampedArray(imageData.data);
    var data = new Uint32Array(imageData.data);
    
    this.databuffer = new ArrayBuffer(imageData.data.length/4);
    this.data = new Uint8ClampedArray(this.databuffer);
        
    // Determine whether Uint32 is little- or big-endian.
    data[1] = 0x0a0b0c0d;
    var isLittleEndian = true;
    if (buf[4] === 0x0a && buf[5] === 0x0b && buf[6] === 0x0c &&
        buf[7] === 0x0d) {
        isLittleEndian = false;
    }

    for (var y = 0; y < this.height; ++y) {
        for (var x = 0; x < this.width; ++x) {
            var i = (y*canvas.width +x)*4;
            var red = isLittleEndian ? data[i] : data[i+3];
            var green = isLittleEndian ? data[i + 1] : data[i+2];
            var blue = isLittleEndian ? data[i + 2] : data[i+1];
            var alpha = isLittleEndian ? data[i + 3] : data[i];
            
            var val = 0.2126 *red + 0.7152*green + 0.0722 *blue; // wikipedia: Stokes et al, 
               //"A Standard Default Color Space for the Internet - sRGB" 
            
            this.data[y * this.width + x] = val;
        }
    }
}
    
    
AcGreyImage.prototype.draw = function(canvas, xPos, yPos) {

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

    for (var y = 0; y < this.height; ++y) {
        for (var x = 0; x < this.width; ++x) {
            var value = this.getAt(x,y);
            data[y * canvasWidth + x] = this.encodeHeight(value, isLittleEndian);
        }
    }

    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
}
    
//private:
    // height is 0 to 255, littleEndian is a bool
    // todo - this is pure virtual (must be overridden)
    // depending on the bit depth
AcGreyImage.prototype.encodeHeight = function(value, littleEndian) {
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
