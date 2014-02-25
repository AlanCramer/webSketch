
function initCanvas(canvas) {
    //var context = canvas.getContext('2d');
    
    var sceneInfo = new SceneInfo();
    canvas.sceneInfo = sceneInfo;
    
    setInterval(drawMe, 25);
    
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