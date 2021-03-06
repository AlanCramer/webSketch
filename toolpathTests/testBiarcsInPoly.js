var polydata = [
    {x:100, y:100},
    {x:140, y:100},
    {x:200, y:130},
    {x:400, y:100},
    {x:500, y:200},
    {x:500, y:400},
    {x:400, y:400},
    {x:100, y:200},
    {x:120, y:200},
    {x:420, y:380},
    {x:450, y:380}, 
    {x:350, y:150},
    {x:300, y:200},
    ];
        
drawTestPoly = function(canvas) {

    var context = canvas.getContext('2d');

    context.beginPath();
    var pt0 = polydata[0];
    context.moveTo(pt0.x, pt0.y);
    
    for (var i = 1; i < polydata.length; ++i) {
        pt = polydata[i];
        context.lineTo(pt.x, pt.y);
    }
    context.lineTo(pt0.x, pt0.y);
    
    context.strokeStyle = 'black';
    context.stroke();
    context.closePath();
}

labelPolyPts = function(canvas) {

    var ctx = canvas.getContext('2d');

    //ctx.beginPath();
    
    for (var i = 0; i < polydata.length; ++i) {
        pt = polydata[i];
        ctx.fillText(i.toString(), pt.x, pt.y-7);
    }
    
    //ctx.closePath();
}

testBiarcsInPoly = function() {

    var canvas = document.getElementById("testCanvas");
    var ctx = canvas.getContext('2d');
    
    drawTestPoly(canvas);
    labelPolyPts(canvas);
    
    ctx.strokeStyle = 'red';
    drawArc3Pts(ctx, polydata[0], polydata[2], polydata[3]);
    //drawArc3Pts(ctx, polydata[0], polydata[2], polydata[11]);
    drawArc3Pts(ctx, polydata[2], polydata[11], polydata[4]);
    //drawArc3Pts(ctx, polydata[12], polydata[11], polydata[4]);  
}

