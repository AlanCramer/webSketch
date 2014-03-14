
// given an array of objects with properties x and y
//    that represent a curve in the plane (ordered)
// return a (shorter) array of points that approximates that curve

var SimplifyCurve = function(ptArray, err) {

    
}

var distPointPoint = function (p0, p1) {
    return Math.sqrt( (p1.x-p0.x)*(p1.x-p0.x) + (p1.y-p0.y)*(p1.y-p0.y));
}

// lineSeg = {p0, p1} where p0 = {x, y}
var distPointLineseg = function (pt, lineseg) {

    var line = makeLine(lineseg.p0, lineseg.p1);
    var dline = distPointLine(pt, line);
    var dp0 = distPointPoint(pt, lineseg.p0);
    var dp1 = distPointPoint(pt, lineseg.p1);

    return Math.min(dline, dp0, dp1);
}

// pt = (x,y) line is ax+by+c=0
var distPointLine = function (pt, line) {

    var numer = Math.abs(line.a*pt.x+line.b*pt.y+line.c);
    var denom = Math.sqrt(line.a*line.a + line.b*line.b);
    
    var res = numer/denom;
    
    return res;
}

var makeLine = function (pt0, pt1) {

    var a = pt1.x - pt0.x;
    var b = pt0.y - pt1.y;
    var c = pt0.x*(pt1.y-pt0.y) - pt0.y*(pt1.x-pt0.x);
    
    return {a:a,b:b,c:c};
}

var RamerDouglasPeucker = function(PointList, epsilon) {
    // Find the point with the maximum distance
    var dmax = 0;
    var index = 0;
    var end = PointList.length - 1;
    var resultList = [];
    
    for (var i = 0; i < end; ++i) {
        var d = distPointLineseg(PointList[i], {p0:PointList[0], p1:PointList[end-1]}); 
        if ( d > dmax ) {
            index = i
            dmax = d
        }
    }
    // If max distance is greater than epsilon, recursively simplify
    if ( dmax > epsilon ) {
        // Recursive call
        var recResults1 = RamerDouglasPeucker(PointList.slice(0, index), epsilon);
        var recResults2 = RamerDouglasPeucker(PointList.slice(index,end), epsilon);
 
        // Build the result list
        resultList = recResults1;
        resultList = resultList.concat(recResults2);
    } else {
        resultList.push(PointList[0]);
        resultList.push(PointList[end]);
    }
    // Return the result
    return resultList;
}

