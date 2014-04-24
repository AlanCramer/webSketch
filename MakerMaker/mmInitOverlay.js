
function mmInitOverlay(canvas) {
    
    
    setInterval( function() { drawOverlay(canvas); } , 25);
    
    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas, message);
        
        onMouseMove(canvas, evt);
    }, false);


    canvas.addEventListener('mousedown', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse Down position: ' + mousePos.x + ',' + mousePos.y;
        writeMessage(canvas, message);
        
        onMouseDown(canvas, evt);
        
    }, false);
    
    canvas.addEventListener('mouseup', function(evt) {
    
        onMouseUp(canvas, evt);
        
    }, false);
        
}


function drawOverlay(canvas) {

    
    if (canvas && canvas.IsMouseDown) {
    
        var st = canvas.startPt;
        var en = canvas.curPt;
        var dx = (en.x - st.x);
        var dy = (en.y - st.y);
    
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width, canvas.height);
        
        ctx.save();
        ctx.beginPath();
 
        if (cmdState.active == 'rect') {
            ctx.rect(st.x, st.y, dx, dy);
        }

        if (cmdState.active == 'circ') {
 
            var rad = Math.sqrt(dx*dx + dy*dy);
            ctx.arc(st.x, st.y, rad, 0, 2*Math.PI, true);
        }
        
        ctx.fill();
        ctx.restore();
    }
}


