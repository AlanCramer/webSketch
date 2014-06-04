
testMathUtil = function() {

    var myGraph = new Graph({
        canvasId: 'testCanvas',
        minX: -5,
        minY: -5,
        maxX: 5,
        maxY: 5,
        unitsPerTick: 1
    });

    var pts = [
        {x:-3, y:0}, 
        {x:-1, y:4}, 
        {x: 1, y:3},  
        {x: 3, y:0},
    ];

    myGraph.drawEquation(function(x) {
        return 1 * x;
    }, 'red', 1);
    
    var c = { center: {x: 3, y:1 }, radius: 2};
    myGraph.drawCircle(c, 'blue', 1);
              
    var intPts = intersectLineCircle({x:0,y:0}, {x:1, y:1}, c);  
    myGraph.drawPointSet(intPts, 'orange', 5);
    
    var c2 = { center: {x:-2, y:-2 }, radius: 2};
    myGraph.drawCircle(c2, 'blue', 1);
    
    var intPts = intersectLineCircle({x:0,y:0}, {x:1, y:1}, c2);
    myGraph.drawPointSet(intPts, 'orange', 5);
    
    
}



