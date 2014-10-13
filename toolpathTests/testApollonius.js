
drawCircle = function(ctx, c) {

    ctx.beginPath();
    ctx.arc(c.center.x, c.center.y, c.radius, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.stroke();
}

testApollonius = function() {

    c1 = {
        center: { x: 100, y:100 },
        radius: 20
    };

    c2 = {
        center: { x: 300, y:200 },
        radius: 30
    };

    c3 = {
        center: { x: 200, y:300 },
        radius: 40
    };

    var canvas = document.getElementById("testCanvas");
    var ctx = canvas.getContext('2d');
    
    drawCircle(ctx, c1);
    drawCircle(ctx, c2);
    drawCircle(ctx, c3);    
    
    var res = findApolloniusCircles(c1, c2, c3);
    
    ctx.strokeStyle('red');
    for (var i = 0; i < res.length; ++i) {

        drawCircle(res[i]);
    }
    
}


