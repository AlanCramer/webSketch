
var Circles = [];
var dragging = false;
var origDragPos = {};

getScaledPos = function(pos) {
    
    var ret = {};
    
    var scale = 10;
    var offx = 200;
    var offy = 200;
    
    ret.x = (pos.x-offx)/scale;
    ret.y = (pos.y-offy)/scale;
    
    return ret;
}

drawCircle = function(ctx, c) {

    var scale = 10; // duplication!
    var offx = 200;
    var offy = 200;

    ctx.beginPath();
    ctx.arc(c.cx*scale+offx, c.cy*scale+offy, c.cr*scale, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.stroke();
}

ptInCirc = function(p, c) {

    return ((p.x - c.cx)*(p.x - c.cx) + (p.y - c.cy)*(p.y - c.cy) < c.cr*c.cr);
}

prehighlight = function(pos) {

    for (icirc = 0; icirc < Circles.length; ++icirc) {
    
        var circle = Circles[icirc];
        circle.preHigh = false;
 
        if (ptInCirc(pos, circle)) 
            circle.preHigh = true;   
    }
}

drag = function(pos) {

    var dragDelta = { x: pos.x - origDragPos.x, y: pos.y - origDragPos.y };
    for (icirc = 0; icirc < Circles.length; ++icirc) {
    
        var circle = Circles[icirc];
 
        if (circle.preHigh){
        
            circle.cx = circle.origx + dragDelta.x;
            circle.cy = circle.origy + dragDelta.y;
        }
    }

}

drawAll = function() {

    var canvas = document.getElementById("testCanvas");
    var ctx = canvas.getContext('2d');

    for (icirc = 0; icirc < Circles.length; ++icirc) {
        
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
    
        var c = Circles[icirc];
        
        if (c.preHigh) {
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 3;
        }
        
        drawCircle(ctx, Circles[icirc]);
    }
    
    var res = findApolloniusCircles(Circles[0], Circles[1], Circles[2]);
    
    ctx.strokeStyle = 'red';
    var lw = 1;
    ctx.lineWidth = lw;
    for (var i = 0; i < res.length; ++i) {

        if (res[i])
            drawCircle(ctx, res[i]);
        // lw++
        // ctx.lineWidth = lw;
    }
}

initTestApollonius = function() {

    var c1 = {
        cx:-2,
        cy:3,
        cr:3
    };

    var c2 = {

        cx:6,
        cy:6,
        cr:2
    };

    var c3 = {

        cx:3,
        cy:-3,
        cr:3
    };

    Circles.push(c1);
    Circles.push(c2);
    Circles.push(c3);
    
}


