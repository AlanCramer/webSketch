
function Path() {

    this.ptdirs = []; // array of positions and dir, x,y,dir
    this.pathSegments = []; // subarrays (by refs) of the above, collected in order 
    
    this.findFirstNonVisited = function() {
                
        var iPtDir;        
        for (i=0; i < this.ptdirs.length; ++i) {
            
            iPtDir = this.ptdirs[i];
            if (!iPtDir.visited || iPtDir.visited != true)
                return iPtDir;
        }
    }
    
    this.drawSegments = function(canvas) {
        
        var i;
        for (i=0; i < this.pathSegments.length; ++i) {
            this.pathSegments[i].draw(canvas);
        }
    }
    
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
