
function Path() {

    this.ptdirs = []; // array of positions and dir, x,y,dir
    this.pathSegments = []; // subarrays (by refs) of the above, collected in order 
    this.pathSimpleSegs = []; // reduced pathSegments
    
    this.buildSimpleSegs = function(err) {
        
        var i;
        var simpSeg;
        
        for (i=0; i < this.pathSegments.length; ++i) {
//            simpSeg = new Array();
            simpSeg = RamerDouglasPeucker(this.pathSegments[i], err);
            
            this.pathSimpleSegs.push(simpSeg);
        }
    } 
    
    var getGCodeMoveTo = function(pt, zVal, pixelsPerMm) {
            
        // paths are in pixels
        // convert to inches
        var conX = pt.x/(25.4*pixelsPerMm);
        var conY = pt.y/(25.4*pixelsPerMm);
        
        conX = conX.toFixed(5);
        conY = conY.toFixed(5);
        
        dataStr = "X" + conX.toString() + " Y" + conY.toString() + " Z" + zVal.toString();
        
        return dataStr;
    }
    
    this.generateGCode = function(pixelsPerMm) {
        var gCode = "data:text/csv;charset=utf-8,";
        
        // todo: comment string 
        // (Box generated by.. <ApplicationName> on <Date>)
        // (dims)
        // (material)
        // (toolbit)
        gCode += "(ToDo, add information about what, how, when, and who made this file)\n\n";
        
        // initialization
        gCode += "G17 (set XY Plane)\n";
        gCode += "G20 (inches)\n";
        gCode += "G40 (Tool Radius Compensation: off)\n";
        gCode += "G49 (Tool Length Offset Compensation: off)\n";
        gCode += "G54 (Work Coordinate System)\n";
        gCode += "G80 (Cancel Canned Cycle)\n";
        gCode += "G90(absolute programming)\n";
        gCode += "G94 (feedrate per minute)\n";
        gCode += "G0 Z1.0(seek to z = 1)\n"; 
        gCode += "F120.0 (feedrate in inches per minute)\n";
        
        var dataStr, jogSt;
        var cutHeight = -0.1;
        var jogHeight = .9;
        
        this.pathSimpleSegs.forEach(function(pathSeg, iSeg) {
            
            gCode += "G0 Z" + jogHeight.toString() + "\n"; // pull up to ceiling
            jogSt = pathSeg[0];
            dataStr = getGCodeMoveTo(jogSt, jogHeight, pixelsPerMm);
            gCode += dataStr + "\n";
            
            pathSeg.forEach(function(ptDir, iPtDir) {
            
                dataStr = getGCodeMoveTo(ptDir, cutHeight, pixelsPerMm);
                gCode += dataStr + "\n";
            });
        });
        
        gCode += "G0 Z" + jogHeight.toString() + "\n"; // pull up to ceiling
        
        // todo, move this to application (main controller)
        var encodedUri = encodeURI(gCode);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "partGCode.nc");
        
        link.click();
    }
    
    this.drawSegments = function(canvas) {
        
        var ctx = canvas.getContext('2d');
        var i;
        for (i=0; i < this.pathSegments.length; ++i) {
            drawPtDirs(ctx, this.pathSegments[i]);
        }
    }
    
    this.drawSimpleSegments = function(canvas) {
        
        var ctx = canvas.getContext('2d');
        var i;
        for (i=0; i < this.pathSimpleSegs.length; ++i) {
            drawPtDirsWithLines(ctx, this.pathSimpleSegs[i]);
        }
    }
    
    // draw a line between each point
    var drawPtDirsWithLines = function(ctx, ptdirs) {
            
        ctx.beginPath(); // todo, what's this do again? only for stroke?
        
        ctx.moveTo(ptdirs[0].x, ptdirs[0].y);
        for (i=1; i < ptdirs.length-1; ++i) {
            
            iPtDir = ptdirs[i];
            ctx.lineTo(iPtDir.x, iPtDir.y);            
        }
        ctx.lineTo(ptdirs[0].x, ptdirs[0].y);
        
        ctx.stroke();
    }
    
    var drawPtDirs = function(ctx, ptdirs) {
            
        ctx.beginPath(); // todo, what's this do again? only for stroke?
        
        for (i=0; i < ptdirs.length; ++i) {
            
            iPtDir = ptdirs[i];
            ctx.rect(iPtDir.x, iPtDir.y, 1, 1);            
        }
        
        ctx.fill();
    }
    
    this.draw = function(canvas) {
    
        var i, iPtDir;
        var ctx = canvas.getContext('2d');
        
        drawPtDirs(ctx, this.ptdirs);        
    }
}
