
// given an array of objects with properties x and y
//    that represent a curve in the plane (ordered)
// return a (shorter) array of points that approximates that curve

var SimplifyCurve = function(ptArray, err) {

    
}

var distPointPoint = function (p0, p1) {
    return Math.sqrt( (p1.x-p0.x)*(p1.x-p0.x) + (p1.y-p0.y)*(p1.y-p0.y));
}

// lineSeg = {p0, p1} where each pi = {x, y}
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

// line has form ax+by+c=0
var makeLine = function (pt0, pt1) {

    var a = pt0.y - pt1.y;
    var b = pt1.x - pt0.x;
    var c = pt0.x*pt1.y - pt1.x*pt0.y;
    
    return {a:a,b:b,c:c};
}

// circle with center = {x,y} and radius 
// a, b, c are points with {x, y}
var makeCircle = function (a, b, c) {

    var tmp = 2*(a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y - b.y));
    var cx = ((a.x*a.x + a.y*a.y)*(b.y-c.y) + (b.x*b.x + b.y*b.y)*(c.y-a.y) + (c.x*c.x+c.y*c.y)*(a.y-b.y))/tmp;
    var cy = ((a.x*a.x + a.y*a.y)*(c.x-b.x) + (b.x*b.x + b.y*b.y)*(a.x-c.x) + (c.x*c.x+c.y*c.y)*(b.x-a.x))/tmp;

    var dnsq = ((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y)) * ((b.x-c.x)*(b.x-c.x) + (b.y-c.y)*(b.y-c.y)) * ((c.x-a.x)*(c.x-a.x) + (c.y-a.y)*(c.y-a.y));
    var dd = (a.x*b.y + b.x*c.y + c.x*a.y - a.x*c.y - b.x*a.y - c.x*b.y)^2;
    
    var diam = Math.sqrt(dnsq)/dd;
    
    return { center : {x:cx, y:cy}, radius : diam/2 };
}

var RamerDouglasPeucker = function(PointList, epsilon) {
    // Find the point with the maximum distance
    var dmax = 0;
    var index = 0;
    var dCirc = 0;
    var end = PointList.length - 1;
    var resultList = [];
    
    for (var i = 0; i <= end; ++i) {
        var d = distPointLineseg(PointList[i], {p0:PointList[0], p1:PointList[end]});
        
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

