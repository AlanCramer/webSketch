
var appendRectToProg = function(x1, y1, width, height) {
    var progBox = document.getElementById("progText");
    var prog = progBox.value;
    
    prog = prog + "ctx.fillRect(" + x1 + ", " + y1 + ", " + width + ", " + height + ");\n";
    
    progBox.value = prog;
}

var appendCircToProg = function(x, y, r, st, en, cw) {
    var progBox = document.getElementById("progText");
    var prog = progBox.value;
    
    prog = prog + "ctx.beginPath();\nctx.arc(" + x + ", " + y + ", " + r.toFixed(3) + ", 0, 2*Math.PI, " + cw + ");\nctx.fill();\n";
    
    progBox.value = prog;
}