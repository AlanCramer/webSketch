

function writeMessage(canvas, message) {

    var sb = document.getElementById("statusBar");
    sb.textContent = message;

}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - Math.floor(rect.left),
      y: evt.clientY - Math.floor(rect.top)
    };
}

function onMouseMove(canvas, evt) {
    var mousePos = getMousePos(canvas, evt);
    var point = {x: mousePos.x, y: mousePos.y};
      
    canvas.curPt = point;      
}

function onMouseUp(canvas, evt) {
    var mousePos = getMousePos(canvas, evt);
    var point = {x: mousePos.x, y: mousePos.y};
    
    canvas.IsMouseDown = false;
    canvas.endPt = point;
    
    var st = canvas.startPt;
    var en = canvas.curPt;
    var dx = (en.x - st.x);
    var dy = (en.y - st.y);
    
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width, canvas.height);
      
    if (cmdState.active == 'rect') {
        appendRectToProg(st.x, st.y, dx, dy);
    }

    if (cmdState.active == 'circ') {
            
        var rad = Math.sqrt(dx*dx + dy*dy);
        appendCircToProg(st.x, st.y, rad, 0, 2*Math.PI, true);
    }

    evaluateProgram();
    
    canvas.startPt = null;
    canvas.curPt = null;
    canvas.endPt = null;
}

function onMouseDown(canvas, evt) {
    var mousePos = getMousePos(canvas, evt);
    var point = {x: mousePos.x, y: mousePos.y};
    
    canvas.IsMouseDown = true;
    canvas.startPt = point;
    
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
}
