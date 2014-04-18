
testBiarcs = function() {

    var myGraph = new Graph({
        canvasId: 'testCanvas',
        minX: -5,
        minY: -5,
        maxX: 5,
        maxY: 5,
        unitsPerTick: 1
    });

    var pts = [
        {x:-2, y:0}, 
        {x:-1, y:4}, 
        {x:0, y:-2},
        {x: 1, y:3},  
        {x: 2, y:-2},
        {x: 3, y:3},
    ];
    myGraph.drawPointSet(pts, 'red', 4);

    var eps = .001; // todo: what should this be? seems like a couple of iterations is pretty good
    
    newPts = findBestCircleFit(pts, eps);
    myGraph.drawPointSet(newPts, 'blue', 4);
    
    //var circ = _findBestCircleFit(newPts, eps);
    
    //myGraph.drawCircle(
    //    circ, 'blue', 2
    //);

    var bestCirc = findBestCircleFit(pts, eps);
    myGraph.drawCircle(
        bestCirc.circle, 'red', 2
    );

}



