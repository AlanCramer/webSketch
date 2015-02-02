
drawCircle = function(ctx, c) {

    var scale = 10;
    var offx = 200;
    var offy = 200;

    ctx.beginPath();
    ctx.arc(c.center.x*scale+offx, c.center.y*scale+offy, c.radius*scale, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.stroke();
}

testApollonius = function() {

    c1 = {
        center: { x: 0, y:3 },
        radius: 2
    };

    c2 = {
        center: { x: -2, y:-2 },
        radius: 1
    };

    c3 = {
        center: { x: 3, y:-3 },
        radius: 3
    };

    var canvas = document.getElementById("testCanvas");
    var ctx = canvas.getContext('2d');
    
    drawCircle(ctx, c1);
    drawCircle(ctx, c2);
    drawCircle(ctx, c3);    
    
    var res = findApolloniusCircles(c1, c2, c3);
    
    ctx.strokeStyle = 'red';
    for (var i = 0; i < res.length; ++i) {

        drawCircle(ctx, res[i]);
    }
    
}


