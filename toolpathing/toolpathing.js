
// todo this is a mismash of functions, organize!
// todo remove global pollution

var initBoundryCanvas = function() {
    var pixelsPerMm = $("#pixelsPerMm").val()-0;
    pixelsPerMm = pixelsPerMm || 1;
    
    drawBoundaryCanvas(pixelsPerMm);
}

var clearPathCanvas = function () {
    // todo: ack! js! where is pathcanvas defined?
    var pathctx = pathcanvas.getContext('2d'); 
    pathctx.clearRect(0,0,pathcanvas.width, pathcanvas.height);
}

var clearDrawingCanvas = function () {
    var dwgcan = document.getElementById("mycanvas");
    var ctx = dwgcan.getContext('2d');
   
    ctx.save();
    ctx.fillStyle = "white"; //"#ffffff";
    ctx.fillRect(0,0,dwgcan.width, dwgcan.height);
    ctx.restore();
}

var onGenGCode = function() {

    var pixelsPerMm = $("#pixelsPerMm").val()-0;
    pixelsPerMm = pixelsPerMm || 1;
    MyApp.path.generateGCode(pixelsPerMm);	
}

var onChangeUnits = function (value) {

    $("#pixelsPerMm").val(value);
    drawBoundaryCanvas(value);
}

var onExportSTL = function() {

}


var onChangeResolution = function(value) {

    MyApp.displayRes = value;
    
    var hidCan = $("#hiddencanvas")[0]; // todo: how are selections derefed again? 
    var hidCtx = hidCan.getContext('2d');
    
//    ctx.save();
    hidCtx.scale(value, value);
    drawCutouts(hidCan, MyApp.cutouts, MyApp.layout);    
//    ctx.restore();
    hidCtx.scale(1/value, 1/value);  // todo: why doesn't save restore work as I expect?
    
    var imageData = hidCtx.getImageData(0, 0, hidCan.width, hidCan.height);
    // imageObj = new Image();
    
    
    var canvas = document.getElementById('mycanvas');
    var ctx = canvas.getContext('2d');
//    ctx.imageSmoothingEnabled = false;
//    ctx.crisp-edges = true;
    ctx.scale(2/value, 2/value); // todo 2 because hidCan twice the size of mycanvas?
    
    ctx.drawImage(hidCan, 0,0,canvas.width, canvas.height);
    ctx.scale(value/2, value/2);
}


var drawBoundaryCanvas = function(pixelsPerMm) {
        
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

// todo:  so not the  right place
var onGo3D = function() {

    var matThick = $("#matthkbox").val()-0;
    emptyThe3DScene();
    
    if (MyApp.path)
        MyApp.path.addSimpleSegsToScene();
    
    var path = buildZeroOffsetPath();
    path.addSimpleSegsAsMeshes(matThick);
    MyApp.zOffPath = path;
    
    animate();
}

var onExportOBJ= function() {

    var matThick = $("#matthkbox").val()-0;
    var path = buildZeroOffsetPath();
    path.addSimpleSegsAsMeshes(matThick); // if exists and is up to date, this is not necessary
    
    var obj = meshesToObj(path.meshes);
    exportToFile(obj, "boxmaker.obj");

}

var meshesToObj = function (meshes) {

    var obj = "";
    var vtxCt = 0;
    var mesh;
    
//    obj = meshToObj(meshes[0]);
    for (var imesh = 0; imesh < meshes.length; ++imesh) {
    
        mesh = meshes[imesh];
        obj += meshToObj(mesh, vtxCt);
        vtxCt += mesh.children[0].geometry.vertices.length; // todo: error checking
    }
    
    return obj;
}

var meshToObj = function(mesh, vertexOffset) {
    
    // ToDo: why is the mesh a child of the top object?
    // i.e., what is the three data structure exactly?
    obj = geometryToObj(mesh.children[0].geometry, vertexOffset);
    return obj;
}

// vertexOffset is for merging mutilple objs. 
// The face refs will get the offset added supporting multiple files
// in one obj. 
// todo: material and other reference types 
var geometryToObj = function (geometry, vertexOffset) {
    var s = '';
    for (i = 0; i < geometry.vertices.length; i++) {
        s+= 'v '+(geometry.vertices[i].x) + ' ' +
        geometry.vertices[i].y + ' '+
        geometry.vertices[i].z + '\n';
    }

    for (i = 0; i < geometry.faces.length; i++) {

        s+= 'f '+ (geometry.faces[i].a+1 + vertexOffset) + ' ' +
        (geometry.faces[i].b+1 + vertexOffset) + ' '+
        (geometry.faces[i].c+1 + vertexOffset);

        if (geometry.faces[i].d !== undefined) {
            s+= ' '+ (geometry.faces[i].d+1 +  vertexOffset);
        }
        s+= '\n';
    }

    return s;
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
    pixelsPerMm = pixelsPerMm || 1;
    
    var canvas = document.getElementById('mycanvas');
    var hidcanvas = document.getElementById('hiddencanvas');
            
    var res = document.getElementById("resolutionSlider");
    var resVal = res ? res.value : 1;
            
    var path = buildToolpaths3(toolbitDiam*pixelsPerMm, canvas); //hidcanvas); 
    //var path2 = buildToolpaths3(toolbitDiam*pixelsPerMm, hidcanvas); 
    
    clearPathCanvas();

    path.drawSimpleSegments(pathcanvas);
//    path2.drawSimpleSegments(hidcanvas);

    //path.drawArcSegs(pathcanvas);

    MyApp.path = path;
}


var drawtestsquare = function(canvas) {

    var ctx = canvas.getContext('2d');
    
    // ctx.save();
    // ctx.beginPath();
    
    ctx.moveTo(10,10);
    ctx.lineTo(99, 302);
    ctx.lineTo(157, 302);

    ctx.stroke();
    // ctx.restore();
}

var buildToolpaths3 = function(toolbitDiamInPix, incanvas){

    var inCanvasImage = new AcGrey8Image(incanvas.width,incanvas.height);
    inCanvasImage.initFromCanvas(incanvas); // todo, decide about js ctors

    var dt = new AcGrey16Image(incanvas.width, incanvas.height);

    computeDistTrans(inCanvasImage, dt);
    
    var path = new Path();
    vectorizeDistanceTrf(dt, toolbitDiamInPix/2, path);
    
    path.buildSimpleSegs(1);
    //path.buildArcInterp(2);
    
    return path;
}
