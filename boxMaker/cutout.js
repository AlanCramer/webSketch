function Cutout(length, width, matThick, posSlots, fingerLength, fingerSpacing, toolbitDiam) {

// posSlots can be true, false or null - null means no slots
// negative slots will start "in" and then hit the finger

    this.length = length;
    this.width = width;
    this.matThick = matThick;
    this.posSlots = posSlots;
    this.fingerLength = fingerLength;
    this.fingerSpacing = fingerSpacing;
    this.toolbitDiam = toolbitDiam;
    
    this.draw = function (canvas, x, y) {
        var ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.rect(x,y, this.width, this.length);
        ctx.fill();

        if (this.posSlots === null)
            return;
            
        // draw finger slots - front and back opposite of left and right
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "grey";
        
        var fling = this.fingerLength;
        var antiFling = this.fingerSpacing;
        var totalFingDist = (fling+antiFling);
        var fingCt = (posSlots ? this.width - this.fingerLength : this.length) / totalFingDist;
        
        for (var iSlot = 0; iSlot < fingCt; ++iSlot)
        {
            if (this.posSlots === true)
            {
                var upperX = x+iSlot*totalFingDist+antiFling;
                // upper
                ctx.rect(upperX, y, fling, this.matThick);
                // lower
                ctx.rect(upperX, y+(this.length-0)-(this.matThick-0), fling, this.matThick);
                ctx.fill();
                
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = 'grey';
                
                // upper left
                ctx.arc(upperX + this.toolbitDiam/2, y + this.matThick, this.toolbitDiam/2, 0, 2*Math.PI, true);
                // upper right
                ctx.arc(upperX + fling - this.toolbitDiam/2, y + this.matThick, this.toolbitDiam/2, 0, 2*Math.PI, true);
                ctx.fill();
                     
                ctx.beginPath();
                // lower left
                ctx.arc(upperX + this.toolbitDiam/2, y+(this.length-0)-(this.matThick-0), this.toolbitDiam/2, 0, 2*Math.PI, true);   
                
                // lower right
                ctx.arc(upperX + fling - this.toolbitDiam/2, y+(this.length-0)-(this.matThick-0), this.toolbitDiam/2, 0, 2*Math.PI, true); 
                
                ctx.fill();
                ctx.restore();
            }
            else
            {
                // left 
                ctx.rect(x, y+iSlot*totalFingDist, this.matThick, antiFling);
                // right
                ctx.rect(x +(this.width-0)-(this.matThick-0), y+iSlot*totalFingDist, this.matThick, antiFling);
                ctx.fill();
                
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = 'grey';
                
                // left upper
                ctx.arc(x + this.matThick, y+iSlot*totalFingDist + this.toolbitDiam/2, this.toolbitDiam/2, 0, 2*Math.PI, true);
                // left lower
                ctx.arc(x + this.matThick, y+iSlot*totalFingDist - this.toolbitDiam/2 + this.fingerSpacing, this.toolbitDiam/2, 0, 2*Math.PI, true);
                ctx.fill();
                     
                ctx.beginPath();
                // right upper
                ctx.arc(x +(this.width-0)-(this.matThick-0), y+iSlot*totalFingDist + this.toolbitDiam/2,  this.toolbitDiam/2, 0, 2*Math.PI, true);   
                
                // right lower
                ctx.arc(x +(this.width-0)-(this.matThick-0), y+iSlot*totalFingDist - this.toolbitDiam/2 + this.fingerSpacing,  this.toolbitDiam/2, 0, 2*Math.PI, true); 
                
                ctx.fill();
                ctx.restore();
            }
        }        
            
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        
    }
           
}
