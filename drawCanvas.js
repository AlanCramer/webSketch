function drawCanvas(){
  // get the canvas element using the DOM
  var canvas = document.getElementById('mycanvas');
 
    // Make sure we don't execute when canvas isn't supported
    if (!canvas.getContext){
        alert('You need a real browser to see this demo.');
    }   
    // use getContext to use the canvas for drawing
    var ctx = canvas.getContext('2d');
        
    // Stroked triangle
    ctx.beginPath();
    ctx.moveTo(125,125);
    ctx.lineTo(125,45);
    ctx.lineTo(45,125);
    ctx.closePath();
    ctx.stroke();
 
}
