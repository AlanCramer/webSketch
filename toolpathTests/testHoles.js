
var theApp = {};

drawHole = function() {

    var canvas = document.getElementById("testcanvas");
    var ctx = canvas.getContext('2d');
    
    var w = canvas.width;
    var h = canvas.height;
    
    ctx.save();
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0, w, h);

    ctx.beginPath();
    ctx.fillStyle = "#000000";    
    ctx.arc(w/2, h/2, w/4, 0, 2*Math.PI, true);
    
    ctx.fill();

    ctx.restore();

}

drawGrey = function() {

    var canvas = document.getElementById("testcanvas");
    var ctx = canvas.getContext('2d');
    
    var w = canvas.width;
    var h = canvas.height;
    
    ctx.save();
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0, w, h);

    ctx.beginPath();
    ctx.fillStyle = "#000000";    
    ctx.rect(w/4, h/4, 2*w/3, 2*h/3);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#444444";    
    ctx.rect(w/8, h/8, 5*w/8, 5*h/8);
      
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#AAAAAA";    
    ctx.arc(3*w/8, 3*h/8, w/10, 0, 2*Math.PI, true);
      
    ctx.fill();
    
    ctx.restore();
}

var drawMultiHoles = function() {
    var canvas = document.getElementById("testcanvas");
    var ctx = canvas.getContext('2d');

    ctx.save();

    var w = canvas.width;
    var h = canvas.height;
        
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0,0, w, h);

    ctx.beginPath();
    ctx.fillStyle = "#333333";
    ctx.arc(w/4, h/4, w/8, 0, 2*Math.PI, true); 
    ctx.closePath();    
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#555555";
    ctx.arc(3*w/4, 3*h/4, w/8, 0, 2*Math.PI, true);    
    ctx.closePath();
    ctx.fill();
   
    ctx.fillStyle = "#999999";
    ctx.beginPath();
    ctx.arc(w/4, 3*h/4, w/8, 0, 2*Math.PI, true);    
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

}

var clearCanvas = function (canvas) {
    // todo: ack! js! where is pathcanvas defined?
    var ctx = canvas.getContext('2d'); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var drawPath = function(canvas, path) {

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#0000FF";
    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = 3;
    path.drawSimpleSegments(canvas);
}

var drawPath3D = function(canvas, path3d) {
    var ctx = canvas.getContext('2d');
    
    ctx.save();
    
    ctx.fillStyle = "#0000FF";
    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = 3;

    draw3DPtArrayWithLines(ctx, path3d.pts);

    ctx.restore();
}

var drawPaths = function(canvas, paths) {

    for (var ipath = 0; ipath < paths.length; ++ipath) {
         drawPath(canvas, paths[ipath]);
    }
}

onDrawHole = function() {

    var pathcanvas = document.getElementById('pathcanvas');
    clearCanvas(pathcanvas);

    drawHole();
}  

onDrawGrey = function() {

    var pathcanvas = document.getElementById('pathcanvas');
    clearCanvas(pathcanvas);
    
    drawGrey();
}

onDrawMultiHoles = function() {

    var pathcanvas = document.getElementById('pathcanvas');
    clearCanvas(pathcanvas);
    
    drawMultiHoles();
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];
    
    var fileReadAsDataUrl = new FileReader();
    fileReadAsDataUrl.onload = (function(progEvt) {
        console.log("in data url reader");
        var imageAsDataUrl = progEvt.target.result;
        
        var img = new Image();
        //MyApp.image = img;
        
        img.src = progEvt.target.result;

        var pathcanvas = document.getElementById('pathcanvas');
        var pathctx = pathcanvas.getContext('2d');
        pathctx.clearRect(0,0,pathcanvas.width, pathcanvas.height);
        
        var canvas = document.getElementById('testcanvas');
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvas.width, canvas.height);
      
        ctx.drawImage(img,10,10);//, canvas.width -20, canvas.height -20); // ,canvas.width, canvas.height);
        
    });
    
    fileReadAsDataUrl.readAsDataURL(file);    
}

var onLoadImage = function() {

    var fileElem = $("#openimage");
    fileElem.click();
}

onTestPath = function() {

    var toolbitDiam = 20; // so that radius is 1 px
    var pixelsPerMm = 1;
    
    var canvas = document.getElementById('testcanvas');
    var pathcanvas = document.getElementById('pathcanvas');
            
    var path = buildToolpaths3(toolbitDiam*pixelsPerMm, canvas); 
        
    clearCanvas(pathcanvas);
    drawPath(pathcanvas, path);
    
}

// in pixels
getToolbitDiam = function() {
    
    var tbd = document.getElementById('toolbitDiam');
    var tbdval = tbd.value;
    
    tbdval = tbdval * getPixelsPerInch(); 
    return tbdval;
}

getMatThick = function() {
    
    var mt = document.getElementById('matThick');
    return mt.value;    
}

getDepthPerPass = function() {
    
    var dpp = document.getElementById('depthPerPass');
    return dpp.valueAsNumber;
}

getPixelsPerInch = function() {
    
    var ppi = document.getElementById('pxPerIn');
    var ppival = ppi.value;
    
    return ppival;
}

getPixelsPerMm = function() {
    
    var ppi = getPixelsPerInch();
    
    return ppi / 25.4;
}

onTestPocket = function() {
    
    var canvas = document.getElementById('testcanvas');
    var pathcanvas = document.getElementById('pathcanvas');
    
    var toolbitDiam = getToolbitDiam(); // so that radius is 1 px
    
    var paths = buildPocketToolpaths(canvas, toolbitDiam); 

    clearCanvas(pathcanvas);
    //clearCanvas(canvas);
    for (var i = 0; i < paths.length; ++i) {
        drawPath(pathcanvas, paths[i]);
    }
    
}

onTestGCodePath = function() {

    var toolbitDiam = getToolbitDiam; 
    var canvas = document.getElementById('testcanvas');
            
    var path = buildToolpaths3(toolbitDiam, canvas); 
    
    var gcode = path.generateGCode(getPixelsPerMm(), false);

    exportToFile(gcode, "partGCode.nc");
}


onTestGCodePocket = function() {

    var canvas = document.getElementById('testcanvas');
            
    var paths = buildPocketToolpaths(canvas, getToolBitDiam()); 
    
    var gcode = HA_PathUtil.gCodePaths(paths, getPixelsPerMm());

    exportToFile(gcode, "partGCode.nc");
}

onTestGCodeRoughPass = function() {

    var toolbitDiam = getToolbitDiam(); // in px
    var canvas = document.getElementById('testcanvas');
    var depthPerPass = getDepthPerPass();
    var matThick = getMatThick();
    
    var arrayOfPaths = buildRoughPass(canvas, toolbitDiam, depthPerPass, matThick);
    
    var pathcanvas = document.getElementById('pathcanvas');
    
//    var gcode = HA_PathUtil.gCodePaths(paths, pxPerMm);
    var gcode = HA_PathUtil.gCodeRoughPass(arrayOfPaths, depthPerPass, getPixelsPerMm());

    exportToFile(gcode, "partGCode.nc");
}

buildSlider = function(max, intvl) {

    var pathsSlider = document.getElementById("pathsSlider");
   
    pathsSlider.max = max - 1;
    pathsSlider.step = 1;
    pathsSlider.value = 0;
       
}

onChangeDisplayPath = function(val) {

    if (!theApp || !theApp.roughPassPaths) 
        return;
        
    var pathcanvas = document.getElementById('pathcanvas');
    clearCanvas(pathcanvas); 
    drawPaths(pathcanvas, theApp.roughPassPaths[val]);  
}


onTestRoughPass = function() {

    var toolbitDiam = getToolbitDiam(); // in px
    var canvas = document.getElementById('testcanvas');
    var depthPerPass = getDepthPerPass();
    var matThick = getMatThick();
    
    var arrayOfPaths = buildRoughPass(canvas, toolbitDiam, depthPerPass, matThick);
    
    var pathcanvas = document.getElementById('pathcanvas');
    clearCanvas(pathcanvas);    
    buildSlider(arrayOfPaths.length, depthPerPass);
    
    drawPaths(pathcanvas, arrayOfPaths[0]);    

    theApp.roughPassPaths = arrayOfPaths;
}

onTestRasterPass = function () {

    var toolbitDiam = getToolbitDiam(); // in px
    var canvas = document.getElementById('testcanvas');
    var depthPerPass = getDepthPerPass();
    var matThick = getMatThick();
    
    var inCanvasImage = new AcGrey8Image(canvas.width,canvas.height);
    inCanvasImage.initFromCanvas(canvas); // todo, decide about js ctors
    
    var path = buildRasterPathInXFromImage(inCanvasImage, toolbitDiam);
    
    var pathcanvas = document.getElementById('pathcanvas');
    clearCanvas(pathcanvas);
    
    drawPath3D(pathcanvas, path);

}



