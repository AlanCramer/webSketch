
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
        {x:-3, y:0}, 
        {x:-1, y:4}, 
        {x: 1, y:3},  
        {x: 3, y:0},
    ];
    myGraph.drawPointSet(pts, 'red', 4);

    var eps = .001; // todo: what should this be? seems like a couple of iterations is pretty good
    var circ = findBestCircleFit(pts, eps);
    
    myGraph.drawParametricEqn(
        function(x) {
            return circ.radius*Math.sin(2*Math.PI*x/5) + circ.center.x;
        }, 
        function(x) {
            return circ.radius*Math.cos(2*Math.PI*x/5) + circ.center.y;
        }, 
        'green', 2
    );
}



