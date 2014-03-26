
function LaptopLeg(args) {

    this.args = args;
    
    this.draw = function (ctx, x, y) {

        ctx.save();
        
        var cutawayColor = 'white';
        ctx.fillStyle = "#000000";
        
        var laptopShelfThick = 20;
        
        var pixLen = this.args.length * this.args.pixelsPerMm;
        var pixHeight = this.args.height * this.args.pixelsPerMm;
        var slope = pixHeight/pixLen;
        var perpSlope = -pixLen/pixHeight;
        var theta = Math.atan(pixLen/pixHeight);
  
        // the triangle
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.lineTo(x + pixLen, y);
        ctx.lineTo(x + pixLen, y + pixHeight);
        ctx.lineTo(x,y);
        ctx.closePath();        
        ctx.fill(); 

        // add a nose
        ctx.beginPath();
        ctx.moveTo(x+pixLen/4, slope*(x+pixLen/4));
        ctx.lineTo(x+pixLen/4 - Math.cos(theta)*laptopShelfThick, slope*(x+pixLen/4) + Math.sin(theta)*laptopShelfThick);
        ctx.lineTo(x, y);
        ctx.lineTo(x+pixLen/4, slope*(x+pixLen/4));
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }    
}


function LaptopStand(length, depth, height, matThick, toolbitDiam, pixelsPerMm) {

    this.args = {};
    
    this.args.length = length;
    this.args.depth = depth;
    this.args.height = height;
    this.args.matThick = matThick;
    this.args.toolbitDiam = toolbitDiam;
    this.args.pixelsPerMm = pixelsPerMm;
    
    this.leftLeg = new LaptopLeg(this.args);
    this.rightLeg = new LaptopLeg(this.args);
    
    this.draw = function (canvas, x, y) {
        var ctx = canvas.getContext('2d');
        var cutawayColor = 'white';
        
        // clear the screen
        ctx.save();
        ctx.fillStyle = "white"; //"#ffffff";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.translate(20,20);
        this.leftLeg.draw(ctx, x, y);
        ctx.restore();
        
        ctx.save();
        ctx.translate(300, 0);
        ctx.rotate(Math.PI);
        ctx.translate(-20, -150);
        this.rightLeg.draw(ctx, x, y);
        ctx.restore();
        
        
    };
           
}
