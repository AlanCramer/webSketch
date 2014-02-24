

function writeMessage(canvas, message) {

    var sb = document.getElementById("statusbar");
    sb.textContent = message;
/*
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
*/
}

/*
function writeMessageRed(canvas, message) {
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'red';
    context.fillText(message, 10, 25);
}
*/

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - Math.floor(rect.left),
      y: evt.clientY - Math.floor(rect.top)
    };
}


function onMouseDown(canvas, evt) {
    var mousePos = getMousePos(canvas, evt);
    var context = canvas.getContext('2d');
    
    context.fillStyle = "rgba(255, 165, 0, .5)";

    
    context.moveTo(mousePos.x, mousePos.y);
    context.arc(mousePos.x, mousePos.y, 25, 0,Math.PI*2);
    context.fill();
}
