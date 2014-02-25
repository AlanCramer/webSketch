function clearCanvas(){
  // get the canvas element using the DOM
  var canvas = document.getElementById('mycanvas');
 
    // Make sure we don't execute when canvas isn't supported
    if (!canvas.getContext){
        alert('You need a real browser to see this demo.');
    }   
    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext('2d');
      
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.sceneInfo.points.length=0;
    
    /*  
        // Stroked triangle
        ctx.beginPath();
        ctx.moveTo(125,125);
        ctx.lineTo(125,45);
        ctx.lineTo(45,125);
        ctx.closePath();
        ctx.stroke();
    */
}

function drawMe() {

    var canvas = document.getElementById('mycanvas');
    var sceneInfo = canvas.sceneInfo;
    
    drawScene(canvas, sceneInfo);
    
}

function drawScene(canvas, sceneInfo) {
 
    // Make sure we don't execute when canvas isn't supported
    if (!canvas.getContext){
        alert('drawScene: Canvas does not have a context.');
    }   
    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext('2d');
      
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
    var points = sceneInfo.points;
    for (index = 0; index < points.length; ++index) {

        var point = points[index];
        ctx.fillStyle = "rgba(255, 165, 0, .5)";

        if (sceneInfo.preSelected.indexOf(index) > -1) {
            ctx.fillStyle = "rgba(100, 40, 100, 1)"; 
        }
        
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.arc(point.x, point.y, 10, 0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
 
        var lastIdx = index - 1;
        lastIdx = (index === 0) ? points.length-1 : index -1; 
        lastPoint = points[lastIdx];
  
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.closePath();
        ctx.stroke();
    }

}
