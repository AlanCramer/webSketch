

function LaptopLeg(args) {

    this.args = args;
    
    this.draw = function (ctx, x, y) {

        ctx.save();
        
        var cutawayColor = 'white';
        ctx.fillStyle = "#000000";
        
        var laptopShelfThick = 20;
        
        var pixLen = this.args.depth * this.args.pixelsPerMm;
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

        // cut a slot
        ctx.save();
        ctx.fillStyle = 'red';
        drawRotatedSlot(ctx, this.args.matThick, this.args.matThick, x+pixLen/3, slope*(x+pixLen/3), -theta, 4);
        ctx.restore();
        
        // and another
        ctx.save();
        ctx.fillStyle = 'red';
        drawRotatedSlot(ctx, this.args.height/3, this.args.matThick, x+2*pixLen/3, slope*(x+2*pixLen/3), -theta,4);
        ctx.restore();
        
    }    
}

function LaptopStandCrossBar(length, height, matThick, toolbitDiam) {

    this.length = length;
    this.height = height;
    this.matThick = matThick;
    this.toolbitDiam = toolbitDiam;
    
    this.draw = function (ctx, x, y) {
    
        ctx.save();
        ctx.fillRect(x,y, this.length, this.height);
        ctx.restore();
        
        ctx.save();
        ctx.fillStyle = 'red';
        drawRotatedSlot(ctx, this.height/2, this.matThick, this.length/4, 0, Math.PI/2, 3);
        ctx.restore();
        
        ctx.save();
        ctx.fillStyle = 'red';
        drawRotatedSlot(ctx, this.height/2, this.matThick, 3*this.length/4, 0, Math.PI/2, 3);
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
    
    this.frontBar = new LaptopStandCrossBar(length, matThick*2, matThick, toolbitDiam);
    this.backBar = new LaptopStandCrossBar(length, 2*height/3, matThick, toolbitDiam);
    
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
        
        ctx.save();
        ctx.translate(20, 200);
        this.backBar.draw(ctx, x, y);
        ctx.restore();
        
        ctx.save();
        ctx.translate(20, 300);
        this.frontBar.draw(ctx, x, y);
        ctx.restore();
        
    };
           
}
