

function writeMessage(canvas, message) {

    var sb = document.getElementById("statusbar");
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
    var sceneInfo = canvas.sceneInfo;
    
    if (canvas.IsMouseDown === false) {
        var preSelIdx = sceneInfo.nearPointIdx(mousePos);
     
        if (preSelIdx != -1) {
            sceneInfo.preSelected.push(preSelIdx);
        }
        else {
            sceneInfo.preSelected.length = 0;
        }
    }
    
    if (canvas.IsMouseDown === true && sceneInfo.preSelected.length >0) {
        var point = sceneInfo.getFirstPreSelectedPoint();
        point.X = mousePos.x;
        point.Y = mousePos.y;
    }
}

function onMouseUp(canvas, evt) {
    var mousePos = getMousePos(canvas, evt);
    var point = {X: mousePos.x, Y: mousePos.y};
    
    canvas.IsMouseDown = false;
}

function onMouseDown(canvas, evt) {
    var mousePos = getMousePos(canvas, evt);
    var point = {X: mousePos.x, Y: mousePos.y};
    var sceneInfo = canvas.sceneInfo;
    
    canvas.IsMouseDown = true;
    
    if (sceneInfo.preSelected.length === 0) {
        sceneInfo.points.push(point);
    }
}
