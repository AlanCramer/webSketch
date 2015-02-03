
drawCircle = function(ctx, c) {

    var scale = 10;
    var offx = 200;
    var offy = 200;

    ctx.beginPath();
    ctx.arc(c.cx*scale+offx, c.cy*scale+offy, c.cr*scale, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.stroke();
}

testApollonius = function() {

    c1 = {
        center: { x: -2, y:3 },
        radius: 3,
        cx:-2,
        cy:3,
        cr:3
    };

    c2 = {
        center: { x: 6, y:6 },
        radius: 2,
        cx:6,
        cy:6,
        cr:2
    };

    c3 = {
        center: { x: 3, y:-3 },
        radius: 3,
        cx:3,
        cy:-3,
        cr:3
    };

    var canvas = document.getElementById("testCanvas");
    var ctx = canvas.getContext('2d');
    
    drawCircle(ctx, c1);
    drawCircle(ctx, c2);
    drawCircle(ctx, c3);    
    
    var res = findApolloniusCircles(c1, c2, c3);
    
    ctx.strokeStyle = 'red';
    var lw = 1;
    ctx.lineWidth = lw;
    for (var i = 0; i < res.length; ++i) {

        drawCircle(ctx, res[i]);
        lw++
        ctx.lineWidth = lw;
    }
    
}


