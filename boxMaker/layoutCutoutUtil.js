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

var buildCutouts = function(cutouts, boxDims, fingerLength, fingerSpacing, toolbitDiam) {
    cutouts.bottom = new Cutout(boxDims.length, boxDims.width, boxDims.matThick, null, fingerLength, fingerSpacing, toolbitDiam);
    cutouts.front = new Cutout(boxDims.length, boxDims.height, boxDims.matThick, true, fingerLength, fingerSpacing, toolbitDiam);
    cutouts.back = new Cutout(boxDims.length, boxDims.height, boxDims.matThick, true, fingerLength, fingerSpacing, toolbitDiam);
    cutouts.left = new Cutout(boxDims.height, boxDims.width, boxDims.matThick, false, fingerLength, fingerSpacing, toolbitDiam);
    cutouts.right = new Cutout(boxDims.height, boxDims.width, boxDims.matThick, false, fingerLength, fingerSpacing, toolbitDiam);
}

var buildLayout = function(layout, boxDims, toolbitDiam) {

    var spacing = toolbitDiam*1.1;

    layout.bottom = {};
    layout.bottom.x = (boxDims.height-0)+3*spacing;
    layout.bottom.y = (boxDims.height-0)+3*spacing;
    
    layout.front = {};
    layout.front.x = spacing;
    layout.front.y = (boxDims.height-0)+3*spacing;
    
    layout.back = {};
    layout.back.x = (boxDims.height-0) + (boxDims.width-0) + 5*spacing;
    layout.back.y = (boxDims.height-0) + 3*spacing;

    layout.left = {};
    layout.left.x = (boxDims.height-0) + 3*spacing;
    layout.left.y = spacing;

    layout.right = {};
    layout.right.x = (boxDims.height-0) + 3*spacing;
    layout.right.y = (boxDims.height-0) + (boxDims.length-0) + 5*spacing;
    
}