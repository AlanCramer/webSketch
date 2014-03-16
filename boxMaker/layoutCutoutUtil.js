var drawCutouts = function(canvas, cutouts, layout) {
     
    var ctx = canvas.getContext('2d');
   
    ctx.save();
    ctx.fillStyle = "white"; //"#ffffff";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.restore();
   
/*  A quick test
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(5, 5, 5, 5);
    ctx.restore();
    */
    
    ctx.save();
    ctx.fillStyle = "#000000";

    // annoyingly redundant
    cutouts.bottom.draw(canvas, layout.bottom.x, layout.bottom.y);
    cutouts.front.draw(canvas, layout.front.x, layout.front.y);
    cutouts.back.draw(canvas, layout.back.x, layout.back.y);
    cutouts.left.draw(canvas, layout.left.x, layout.left.y);
    cutouts.right.draw(canvas, layout.right.x, layout.right.y); 

    ctx.restore();
   
}

var buildCutouts = function(cutouts, boxDims, fingerLength, fingerSpacing, toolbitDiam, pixPerMm) {
    cutouts.bottom = new Cutout(boxDims.length, boxDims.width, boxDims.matThick, null, fingerLength, fingerSpacing, toolbitDiam, pixPerMm);
    cutouts.front = new Cutout(boxDims.length, boxDims.height, boxDims.matThick, true, fingerLength, fingerSpacing, toolbitDiam, pixPerMm);
    cutouts.back = new Cutout(boxDims.length, boxDims.height, boxDims.matThick, true, fingerLength, fingerSpacing, toolbitDiam, pixPerMm);
    cutouts.left = new Cutout(boxDims.height, boxDims.width, boxDims.matThick, false, fingerLength, fingerSpacing, toolbitDiam, pixPerMm);
    cutouts.right = new Cutout(boxDims.height, boxDims.width, boxDims.matThick, false, fingerLength, fingerSpacing, toolbitDiam, pixPerMm);
}

var buildLayout = function(layout, boxDims, toolbitDiam, pixelsPerMm) {

    var spacing = toolbitDiam*1.1*pixelsPerMm;
    var height = boxDims.height * pixelsPerMm;
    var width = boxDims.width * pixelsPerMm;
    var length = boxDims.length * pixelsPerMm;

    layout.bottom = {};
    layout.bottom.x = height+3*spacing;
    layout.bottom.y = height+3*spacing;
    
    layout.front = {};
    layout.front.x = spacing;
    layout.front.y = height+3*spacing;
    
    layout.back = {};
    layout.back.x = height + width + 5*spacing;
    layout.back.y = height + 3*spacing;

    layout.left = {};
    layout.left.x = height + 3*spacing;
    layout.left.y = spacing;

    layout.right = {};
    layout.right.x = height + 3*spacing;
    layout.right.y = height + length + 5*spacing;
    
}