
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

onTestPath = function() {

    var toolbitDiam = 20; // so that radius is 1 px
    var pixelsPerMm = 1;
    
    var canvas = document.getElementById('testcanvas');
    var pathcanvas = document.getElementById('pathcanvas');
            
    var path = buildToolpaths3(toolbitDiam*pixelsPerMm, canvas); 
        
    clearCanvas(pathcanvas);
    drawPath(pathcanvas, path);
    
}

onTestPocket = function() {
    
    var canvas = document.getElementById('testcanvas');
    var pathcanvas = document.getElementById('pathcanvas');
    
    var toolbitDiam = 20; // so that radius is 1 px
    var pxPerMm = 1;
    
    var paths = buildPocketToolpaths(canvas, toolbitDiam*pxPerMm); 

    clearCanvas(pathcanvas);
    //clearCanvas(canvas);
    for (var i = 0; i < paths.length; ++i) {
        drawPath(pathcanvas, paths[i]);
    }
    
}

onTestGCodePath = function() {

    var pixelsPerMm = 1;
    var toolbitDiam = 20; // so that radius is 1 px
    var canvas = document.getElementById('testcanvas');
            
    var path = buildToolpaths3(toolbitDiam*pixelsPerMm, canvas); 
    
    var gcode = path.generateGCode(pixelsPerMm, false);

    exportToFile(gcode, "partGCode.nc");
}


onTestGCodePocket = function() {

    var pxPerMm = 1;
    var toolbitDiam = 20; // in px
    var canvas = document.getElementById('testcanvas');
            
    var paths = buildPocketToolpaths(canvas, toolbitDiam*pxPerMm); 
    
    var gcode = HA_PathUtil.gCodePaths(paths, pxPerMm);

    exportToFile(gcode, "partGCode.nc");
}

buildSlider = function(max, intvl) {

    var pathsSlider = document.getElementById("pathsSlider");
   
    pathsSlider.max = max - 1;
    pathsSlider.step = 1;
       
}

onChangeDisplayPath = function(val) {

    if (!theApp || !theApp.roughPassPaths) 
        return;
        
    var pathcanvas = document.getElementById('pathcanvas');
    clearCanvas(pathcanvas); 
    drawPaths(pathcanvas, theApp.roughPassPaths[val]);  
}


onTestRoughPass = function() {

    var toolbitDiam = 20; // in px
    var canvas = document.getElementById('testcanvas');
    var depthCtrl = document.getElementById('depthPerPass');
    var depthPerPass = depthCtrl.valueAsNumber;
    
    var arrayOfPaths = buildRoughPass(canvas, toolbitDiam, depthPerPass);
    
    var pathcanvas = document.getElementById('pathcanvas');
    clearCanvas(pathcanvas);    
    buildSlider(arrayOfPaths.length, depthPerPass);
    
    drawPaths(pathcanvas, arrayOfPaths[0]);    

    theApp.roughPassPaths = arrayOfPaths;
}



