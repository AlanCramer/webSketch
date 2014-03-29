


function TestParts(length, width, diameter, matThick, toolbitDiam, pixelsPerMm) {


    this.args = {};
    
    this.args.length = length;
    this.args.width = width;
    this.args.diameter = diameter;
    this.args.matThick = matThick;
    this.args.toolbitDiam = toolbitDiam;
    this.args.pixelsPerMm = pixelsPerMm;
    
    // todo extract the layout
    this.draw = function (canvas, x, y) {
        var ctx = canvas.getContext('2d');
        var cutawayColor = 'white';
        var background = 'white';
        var drawColor = 'black';
        var spacer = this.args.toolbitDiam*pixelsPerMm*2;
        
        var radius = this.args.diameter/2;
        
        // clear the screen
        ctx.save();
        ctx.fillStyle = background;
        ctx.fillRect(0,0,canvas.width, canvas.height);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = drawColor;
        
        ctx.beginPath();
        ctx.arc(spacer+radius, spacer+radius, radius, 0, 3*Math.PI/2);
        ctx.fill();
                
        var rx, ry, rl, rw;
        rx = spacer;
        ry = spacer*2+(diameter-0); // spacer below the circle
        rl = this.args.length;
        rw = this.args.width;
        ctx.beginPath();
        ctx.rect(rx, ry, rl, rw);
        ctx.fill();

        ctx.restore();
    };
           
}
