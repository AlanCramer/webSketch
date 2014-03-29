

function LaptopLeg(args) {

    this.args = args;
    
    this.draw = function (ctx, x, y) {

        ctx.save();
        
        var cutawayColor = 'white';
        ctx.fillStyle = "#000000";
        
        var laptopShelfThick = 20;
        
        var pixPerMm = this.args.pixelsPerMm-0;
        var pixLen = this.args.depth;
        var pixHeight = this.args.height;
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

        // cut the front slot
        ctx.save();
        ctx.fillStyle = 'white';
        drawRotatedSlot(ctx, this.args.matThick*2, this.args.matThick, x+pixLen/3, slope*(x+pixLen/3), -theta, this.args.toolbitDiam);
        ctx.restore();
        
        // and another for the back
        ctx.save();
        ctx.fillStyle = 'white';
        drawRotatedSlot(ctx, this.args.height/3, this.args.matThick, x+2*pixLen/3, slope*(x+2*pixLen/3), -theta, this.args.toolbitDiam);
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
        ctx.fillStyle = 'white';
        drawRotatedSlot(ctx, this.height/2, this.matThick, this.length/4, 0, Math.PI/2, this.toolbitDiam*1.1);
        ctx.restore();
        
        ctx.save();
        ctx.fillStyle = 'white';
        drawRotatedSlot(ctx, this.height/2, this.matThick, 3*this.length/4, 0, Math.PI/2, this.toolbitDiam*1.1);
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
    
    this.frontBar = new LaptopStandCrossBar(length, matThick*4, matThick, toolbitDiam);
    this.backBar = new LaptopStandCrossBar(length, height/2, matThick, toolbitDiam);
    
    // todo extract the layout
    this.draw = function (canvas, x, y) {
        var ctx = canvas.getContext('2d');
        var cutawayColor = 'white';
        var spacer = this.args.toolbitDiam*2+10;
        
        // clear the screen
        ctx.save();
        ctx.fillStyle = "white"; //"#ffffff";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.translate(spacer, spacer);
        this.leftLeg.draw(ctx, x, y);
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.args.length, 0);
        ctx.rotate(Math.PI);
        ctx.translate(-spacer, -this.args.height-spacer*4);
        this.rightLeg.draw(ctx, x, y);
        ctx.restore();
        
        ctx.save();
        ctx.translate(spacer, 2*spacer + this.args.height*1.5); // 1.5 really depends on angle
        this.backBar.draw(ctx, x, y);
        
        ctx.translate(0, spacer + 0.5*this.args.height); // ugh, layout!
        this.frontBar.draw(ctx, x, y);
        ctx.restore();
        
    };
           
}
