

drawHoles = function() {

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
