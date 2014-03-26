
// todo this is a mismash of functions, organize!

var initBoundryCanvas = function() {
    var pixelsPerMm = $("#pixelsPerMm").val()-0;
    
    drawBoundaryCanvas(pixelsPerMm);
}

var drawBoundaryCanvas = function(pixelsPerMm) {
    
    var pixelsPerMm = $("#pixelsPerMm").val()-0;
        
    var canvas = document.getElementById('boundaryCanvas');
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    ctx.font = "10px sans-serif";
    var pixVal = 100/pixelsPerMm;
    pixVal = pixVal.toFixed(1);
    
    ctx.fillText(pixVal, 93, 8);
    ctx.fillText("mm", 120, 8);

    ctx.beginPath();
    for (var i = 0; i < canvas.width; i += 10) {
        var y = (i / 100 == parseInt(i / 100)) ? 0 : 10;
        ctx.moveTo(i + 15, y);
        ctx.lineTo(i + 15, 15);
        var x = (i / 100 == parseInt(i / 100)) ? 0 : 10;
        ctx.moveTo(x, i + 15);
        ctx.lineTo(15, i + 15);
    }
    ctx.stroke();

}

var emptyThe3DScene = function() {
        
    while(group.children.length>0) {
    
        // must be explicitly removed
        group.remove(group.children[group.children.length-1]);
    }
}


var onGo3D = function() {

    var matThick = $("#matthkbox").val()-0;
    emptyThe3DScene();
    
    MyApp.path.addSimpleSegsToScene();
    
    var path = buildZeroOffsetPath();
    path.addSimpleSegsAsMeshes(matThick);
    
    animate();
}

var buildZeroOffsetPath = function() {

    var pixelsPerMm = $("#pixelsPerMm").val()-0;
    var canvas = document.getElementById('mycanvas');
    var pathcanvas = document.getElementById('pathcanvas');
            
    // todo: this is hiding a bug - zero offset causes problems for the laptop stand        
    var path = buildToolpaths3(1.0, canvas)      
    return path;  
}

var onCalcPath = function() {

    var toolbitDiam = $("#toolbitDiam").val()-0;
    var pixelsPerMm = $("#pixelsPerMm").val()-0;
    var canvas = document.getElementById('mycanvas');
    var hidcanvas = document.getElementById('hiddencanvas');
            
    var res = document.getElementById("resolutionSlider");
    var resVal = res.value;
    var factor = 1/resVal;
            
    var path = buildToolpaths3(toolbitDiam*pixelsPerMm*resVal, canvas); // hidcanvas); 
    
    var pathctx = pathcanvas.getContext('2d');
    pathctx.clearRect(0,0,pathcanvas.width, pathcanvas.height);

    //path.scaleSimpleSegs(factor);
    path.drawSimpleSegments(pathcanvas);
//    path.drawSegments(incanvas);
//    path.draw(pathcanvas);

    MyApp.path = path;
}

var buildToolpaths3 = function(toolbitDiamInPix, incanvas){

    var inCanvasImage = new AcGrey8Image(incanvas.width,incanvas.height);
    inCanvasImage.initFromCanvas(incanvas); // todo, decide about js ctors

    var dt = new AcGrey16Image(incanvas.width, incanvas.height);

    computeDistTrans(inCanvasImage, dt);
    
    var path = new Path();
    vectorizeDistanceTrf(dt, toolbitDiamInPix/2, path);
    
    path.buildSimpleSegs(1);
    return path;
}
