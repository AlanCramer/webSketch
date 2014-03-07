
function Path() {

    this.ptdirs = []; // array of positions and dir, x,y,dir
    
    this.draw = function(canvas) {
    
        var i, iPtDir;
        var ctx = canvas.getContext('2d');
        
        ctx.beginPath(); // todo, what's this do again? only for stroke?
        
        for (i=0; i < this.ptdirs.length; ++i) {
            
            iPtDir = this.ptdirs[i];
            ctx.rect(iPtDir.x, iPtDir.y, 1, 1);            
        }
        
        ctx.fill();
        
    }
}
