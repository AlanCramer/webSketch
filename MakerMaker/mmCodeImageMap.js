
findImageDelta = function(img0, img1) {

    var imageDelta;
    var i, j, minx, maxx, miny, maxy;
    maxx = maxy = -1;
    minx = miny = Math.max(img0.width, img0.height) +1;
    
    for (i = 0; i < img0.width; ++i)
    {
        for (j = 0; j < img0.height; ++j)
        {
            if (img1.getAt(i,j) != img0.getAt(i, j)){
                
                if (i < minx)
                    minx = i;
                    
                if (i > maxx)
                    maxx = i;
                    
                if (j < miny)
                    miny = j;
                
                if (j > maxy)
                    maxy = j;
            }
        }
    }

    // if any are set, they all should be set
    if (maxx >= 0)
    {
        imageDelta = img1.copyRegion(minx, miny, maxx-minx, maxy-miny);
    }
    
    return imageDelta;
}


var buildCodeImageMap = function(code, args) {

    // swap the canvas we draw on
    var canvas = document.getElementById("evalCanvas");
    args[0] = canvas;
    
    var statements = code.split(";");
    
    var endFn = ";}";
    var subCode, error;
    var lastImage = new AcGrey8Image(canvas.width, canvas.height);
    var curImage = new AcGrey8Image(canvas.width, canvas.height);
    lastImage.initFromCanvas(canvas);
    
    // an imageDelta is an {x:x, y:y, delta:acGreyImage} 
    var imageDelta;
    var imageDeltas = [];
    var imageDeltaMap = {};
    
    for (var iLine = 0; iLine < statements.length; ++iLine) {

        error = false;
        subCode = "";
        for (var jLine = 0; jLine <= iLine; ++jLine) {
            subCode = subCode + statements[jLine] + ";"; 
        }
        
        // close the function, unless it's the whole thing....
        if (jLine < statements.length)
            subCode = subCode + endFn;

        try {
        
            // builds draw code into function called "fn"
            eval(subCode);
        } catch (e){
        
            error = true;
            alert("Error during eval: " + e.name + "\nFor code:\n" + subCode);
        }
        
        try {
    
            fn.apply(null, args);
        } catch (e) {
        
            error = true;    
            alert("Error during apply : " + e.name + "\niLine, jLine, code:\n " + iLine + " " + jLine + "\n" + code + "\nwith args: \n" + args);
        }
        
        if (!error) {
            
            curImage.initFromCanvas(canvas);
     
            imageDelta = findImageDelta(curImage, lastImage);

            if (imageDelta)
            {
                imageDeltaMap[subcode] = imageDelta;
            }
            
            curImage.copy(lastImage);
        }
        
    }

}

