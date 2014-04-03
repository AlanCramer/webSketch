
function Path() {

    this.ptdirs = []; // array of positions and dir, x,y,dir
    this.pathSegments = []; // subarrays (by refs) of the above, collected in order 
    this.pathSimpleSegs = []; // reduced pathSegments
    
    this.meshes = [];
    
    this.scaleSimpleSegs = function(scale) {
    
        for (var i=0; i < this.pathSimpleSegs.length; ++i) {
            
            var curSeg = this.pathSimpleSegs[i];
            
            for (var j = 0; j < curSeg.length; ++j)
            {
                curSeg[j].x *= scale;
                curSeg[j].y *= scale;
          
            }
        }
    }
    
    this.buildThreeShape = function(pathSeg) {
    
        var theShape = new THREE.Shape();
        
        var firstPt = pathSeg[0];
        var lastPt = pathSeg[pathSeg.length -1];
        var i;
        
        theShape.moveTo( firstPt.x, firstPt.y );
        
        for (i=1; i < pathSeg.length; ++i) {
            theShape.lineTo(pathSeg[i].x, pathSeg[i].y);
        }
        
        theShape.lineTo(lastPt.x, lastPt.y);
        
        return theShape;
    }
    
    this.addSimpleSegsAsMeshes = function(matThick) {
    
        var i;
        for (i=0; i < this.pathSimpleSegs.length; ++i) {
            var nextShape = this.buildThreeShape(this.pathSimpleSegs[i]);
                
            var extrudeSettings = { amount: matThick }; // bevelSegments: 2, steps: 2 , bevelSegments: 5, bevelSize: 8, bevelThickness:5

            extrudeSettings.bevelEnabled = false;
            extrudeSettings.steps = 1;

            // todo  - remove positioning hack. 
            var mesh = addShape( nextShape, extrudeSettings, 0xBF936D, -150, 300, 0, Math.PI, 0, 0, 1 );
            //addLine( nextShape, 0x000000, -150, 300, 0, Math.PI, 0, 0, 1 );
            
            this.meshes.push(mesh);
        }
    }
    
    this.addSimpleSegsToScene = function() {
    
        var i;
        for (i=0; i < this.pathSimpleSegs.length; ++i) {
            var nextShape = this.buildThreeShape(this.pathSimpleSegs[i]);

            // todo  - remove positioning hack. 
            addLine( nextShape, 0x000000, -150, 300, 0, Math.PI, 0, 0, 1 );
        }
    }
    
    
    this.buildSimpleSegs = function(err) {
        
        var i, simpSeg;
        
        for (i=0; i < this.pathSegments.length; ++i) {

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
            
        var i, iPtDir;    
        ctx.beginPath(); 
        
        ctx.moveTo(ptdirs[0].x, ptdirs[0].y);
        for (i=1; i < ptdirs.length-1; ++i) {
            
            iPtDir = ptdirs[i];
            if (iPtDir.circleRad > 0) // js abuse, being too subtle todo: make it explicit
            {
                //ctx.arcTo(ptdirs[i-1].x, ptdirs[i-1].y, ptdirs[i+1].x, ptdirs[i+1].y, iPtDir.circleRad);
            }
            else
            {
                ctx.lineTo(iPtDir.x, iPtDir.y);  
            }
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
