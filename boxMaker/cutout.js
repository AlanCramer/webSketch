function Cutout(length, width, matThick, posSlots, fingerLength, fingerSpacing, toolbitDiam, pixelsPerMm) {

// posSlots can be true, false or null - null means no slots
// negative slots will start "in" and then hit the finger

    this.length = length;
    this.width = width;
    this.matThick = matThick;
    this.posSlots = posSlots;
    this.fingerLength = fingerLength;
    this.fingerSpacing = fingerSpacing;
    this.toolbitDiam = toolbitDiam;
    this.pixelsPerMm = pixelsPerMm;
    
    this.draw = function (canvas, x, y) {
        var ctx = canvas.getContext('2d');
        var cutawayColor = 'white';
        
        ctx.save();
        
        // var pixScale = 1/this.pixelsPerMm;
        // ctx.scale(pixScale, pixScale);
        
        var pixelsPerMm = this.pixelsPerMm;
        
        var pixLen = this.length * pixelsPerMm;
        var pixWid = this.width * pixelsPerMm;
        var pixToolDiam = this.toolbitDiam * pixelsPerMm;
        var pixMatThick = this.matThick * pixelsPerMm;
        var pixFinSpacing = this.fingerSpacing * pixelsPerMm;
        
        ctx.beginPath();
        ctx.rect(x,y, pixWid, pixLen);
        ctx.fill();

        if (this.posSlots === null)
        {
            ctx.restore();
            return;
        }    
        // draw finger slots - front and back opposite of left and right

        ctx.beginPath();
        ctx.fillStyle = cutawayColor;
        
        var pixFinLen = this.fingerLength * pixelsPerMm;
        var antiFling = this.fingerSpacing * pixelsPerMm;
        var totalFingDist = (pixFinLen+antiFling);
        var fingCt = (posSlots ? pixWid - pixFinLen : pixLen) / totalFingDist;
        var dogBoneRadius = pixToolDiam*(.75);
        
        for (var iSlot = 0; iSlot < fingCt; ++iSlot)
        {
            if (this.posSlots === true)
            {
                var upperX = x+iSlot*totalFingDist+antiFling;

                // upper
                ctx.rect(upperX, y, pixFinLen, pixMatThick);
                // lower
                ctx.rect(upperX, y+(pixLen)-(pixMatThick), pixFinLen, pixMatThick);
                ctx.fill();
                
//                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = cutawayColor;
                
                // upper left
                ctx.arc(upperX + dogBoneRadius, y + pixMatThick, dogBoneRadius, 0, 2*Math.PI, true);
                // upper right
                ctx.arc(upperX + pixFinLen - dogBoneRadius, y + pixMatThick, dogBoneRadius, 0, 2*Math.PI, true);
                ctx.fill();
                     
                ctx.beginPath();
                // lower left
                ctx.arc(upperX + dogBoneRadius, y+ pixLen - pixMatThick, dogBoneRadius, 0, 2*Math.PI, true);   
                
                // lower right
                ctx.arc(upperX + pixFinLen - dogBoneRadius, y+pixLen-pixMatThick, dogBoneRadius, 0, 2*Math.PI, true); 
                
                ctx.fill();
//                ctx.restore();
            }
            else // duplicate - todo: tranform a position and scale neutral cutout
            {
                // left 
                ctx.rect(x, y+iSlot*totalFingDist, pixMatThick, antiFling);
                // right
                ctx.rect(x +pixWid-pixMatThick, y+iSlot*totalFingDist, pixMatThick, antiFling);
                ctx.fill();
                
//                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = cutawayColor;
                
                // left upper
                ctx.arc(x + pixMatThick, y+iSlot*totalFingDist + dogBoneRadius, dogBoneRadius, 0, 2*Math.PI, true);
                // left lower
                ctx.arc(x + pixMatThick, y+iSlot*totalFingDist - dogBoneRadius + pixFinSpacing, dogBoneRadius, 0, 2*Math.PI, true);
                ctx.fill();
                     
                ctx.beginPath();
                // right upper
                ctx.arc(x +pixWid-pixMatThick, y+iSlot*totalFingDist + dogBoneRadius,  dogBoneRadius, 0, 2*Math.PI, true);   
                
                // right lower
                ctx.arc(x +pixWid-pixMatThick, y+iSlot*totalFingDist - dogBoneRadius + pixFinSpacing,  dogBoneRadius, 0, 2*Math.PI, true); 
                
                ctx.fill();
 //               ctx.restore();
            }
        }        
            
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        
    }
           
}
