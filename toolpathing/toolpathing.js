
var buildZeroOffsetPath = function() {

    var pixelsPerMm = $("#pixelsPerMm").val()-0;
    var canvas = document.getElementById('mycanvas');
    var pathcanvas = document.getElementById('pathcanvas');
            
    var path = buildToolpaths3(0.0, canvas)      
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
