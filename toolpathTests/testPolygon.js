

var Polygon = [];
var PointP = {x:0, y:0};

var SelectedEdge = 0;
var StartEdge = 0;
var EndEdge = 3;

var dragging = false;
var origDragPos = {};

var canvasWidth = 600;
var canvasHeight = 400;

updateCanvas = function() {
    
    var canvas = document.getElementById('testCanvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    refreshCanvas();
}


initTestPolygon = function() {



}


drawPolygon = function(ctx, poly) {

    if (poly.length < 2)
        return;
    
    ctx.fillStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000'; 

    ctx.beginPath();
    var pt0 = poly[0];
    ctx.moveTo(pt0.x, pt0.y);
    
    for (var ipt = 1; ipt < poly.length; ++ipt) {
        var pt = poly[ipt];
        ctx.lineTo(pt.x, pt.y);
    }
    
    // closed?
    ctx.lineTo(pt0.x, pt0.y);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}


drawEdge = function(ctx, edgeId, color) {
    
    var s0 = Polygon[edgeId];
    var s1 = Polygon[(edgeId+1)%Polygon.length];
    
    ctx.lineWidth = 3;
    ctx.strokeStyle = color; 
    ctx.beginPath();
    ctx.moveTo(s0.x, s0.y);
    ctx.lineTo(s1.x, s1.y);
    ctx.closePath();
    ctx.stroke();
}

drawStartEnd = function(ctx) {

    var s0 = Polygon[StartEdge];
    var s1 = Polygon[StartEdge+1];
    
    var e0 = Polygon[EndEdge];
    var e1 = Polygon[EndEdge+1];

    drawEdge(ctx, StartEdge,'#ff00ff'); 
    drawEdge(ctx, EndEdge,'#00ff00'); 
}

// line is {a, b, c} where ax + by + c = 0;
drawLine = function(ctx, l) {

    // if x =0 or x = 400, what's y?

    if (Math.abs(l.b) > .1) { 
        var yx0 = -l.c/l.b;
        var yxWidth = (-l.c - l.a*canvasWidth)/l.b;        
    }
    
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ffa000'; 
    ctx.beginPath();
    ctx.moveTo(0, yx0);
    ctx.lineTo(canvasWidth, yxWidth);
    ctx.closePath();
    ctx.stroke();
}


// perp bisectors between start of start and end pts of end
drawPerpBisectors = function(ctx) {

    var s0 = Polygon[StartEdge];
    
    // var e0 = Polygon[EndEdge];
    // var e1 = Polygon[EndEdge+1];
    
    // var line = makePerpBisectLine(s0, e0);
    // drawLine(ctx, line);  

    // line = makePerpBisectLine(s0, e1);
    // drawLine(ctx, line);  

    var line;
    for (var ipt = 2; ipt < Polygon.length; ++ipt) {
        line = makePerpBisectLine(s0, Polygon[ipt]);
        drawLine(ctx, line);  
    }
}

drawCircle = function(ctx, c) {

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000'; 
    ctx.beginPath();
    ctx.arc(c.cx, c.cy, c.cr, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.stroke();
}



drawEdgeCVD = function(ctx, pt, edgeId) {


    var s2 = Polygon[edgeId];
    var s3 = Polygon[(edgeId+1)%Polygon.length];
    
    var pb2 = makePerpBisectLine(pt, s2);
    var pb3 = makePerpBisectLine(pt, s3);
    drawLine(ctx, pb2);
    drawLine(ctx, pb3);
    var intp = intersectLineLine(pb2, pb3);
    drawCircle(ctx, {cx: intp.x, cy:intp.y, cr:10});
    
    // make a line perp to edge2 (from s2 to s3), and through s2
    var q0 = {x:2*s2.x - s3.x, y: 2*s2.y - s3.y};
    var l0 = makePerpBisectLine(q0, s3); // by design, through s2
    //drawLine(ctx, l0);
    var q1 = {x:2*s3.x - s2.x, y: 2*s3.y - s2.y};
    var l1 = makePerpBisectLine(q1, s2);
    //drawLine(ctx, l1);
    var uhat = intersectLineLine(pb2, l0);
    drawCircle(ctx, {cx: uhat.x, cy:uhat.y, cr:8});

    var vhat = intersectLineLine(pb3, l1);
    drawCircle(ctx, {cx: vhat.x, cy:vhat.y, cr:8});
    
    
    // now, parabola from 
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffa000';
    ctx.beginPath();
    ctx.moveTo(uhat.x, uhat.y);
    ctx.quadraticCurveTo(intp.x, intp.y, vhat.x, vhat.y);

    ctx.stroke();
}


