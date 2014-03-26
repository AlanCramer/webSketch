
function drawRotatedSlot(ctx, width, height, x, y, radians, earDiam) {

    ctx.save();
    ctx.beginPath();
    
    ctx.translate(x, y);
    ctx.rotate(radians); 

    ctx.fillRect(0,0,width, height);
    ctx.arc(width-earDiam, 0, earDiam, 0, 2*Math.PI, false);
    ctx.arc(width-earDiam, height, earDiam, 0, 2*Math.PI, false);
    ctx.fill();
    
    ctx.closePath();
    ctx.restore();

}