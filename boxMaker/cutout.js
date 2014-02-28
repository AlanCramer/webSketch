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
                ctx.rect(x+iSlot*totalFingDist+antiFling, y, fling, this.matThick);
                ctx.rect(x+iSlot*totalFingDist+antiFling, y+(this.length-0)-(this.matThick-0), fling, this.matThick);
            }
            else
            {
                ctx.rect(x, y+iSlot*totalFingDist, this.matThick, antiFling);
                ctx.rect(x +(this.width-0)-(this.matThick-0), y+iSlot*totalFingDist, this.matThick, antiFling);
            }
        }        
            
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        
    }
           
}
