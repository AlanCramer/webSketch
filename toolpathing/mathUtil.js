
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
var makeCircleBy3Pts = function (a, b, c) {

    var tmp = 2*(a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y - b.y));
    var cx = ((a.x*a.x + a.y*a.y)*(b.y-c.y) + (b.x*b.x + b.y*b.y)*(c.y-a.y) + (c.x*c.x+c.y*c.y)*(a.y-b.y))/tmp;
    var cy = ((a.x*a.x + a.y*a.y)*(c.x-b.x) + (b.x*b.x + b.y*b.y)*(a.x-c.x) + (c.x*c.x+c.y*c.y)*(b.x-a.x))/tmp;

    var dnsq = ((b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y)) * ((b.x-c.x)*(b.x-c.x) + (b.y-c.y)*(b.y-c.y)) * ((c.x-a.x)*(c.x-a.x) + (c.y-a.y)*(c.y-a.y));
    var dd = (a.x*b.y + b.x*c.y + c.x*a.y - a.x*c.y - b.x*a.y - c.x*b.y)^2;
    
    var diam = Math.sqrt(dnsq)/dd;
    
    return { center : {x:cx, y:cy}, radius : diam/2 };
}

var distancePtCircle = function (pt, cir)
{
    var cc = cir.center;
    var dsq = (pt.x - cc.x)*(pt.x - cc.x) + (pt.y - cc.y)*(pt.y - cc.y);
    
    var d = Math.sqrt(dsq);
    
    return Math.abs(d - cir.radius);
}


var RamerDouglasPeucker = function(pointList, epsilon) {
    // Find the point with the maximum distance
    var dmax = 0;
    var index = 0;
    
    var dC = 0;
    var dCmax = 0;
    var iC = 0;
    var iRad = 0;
    
    var findCircs = false; // turn this on to find circles too
    
    var end = pointList.length - 1;
    var resultList = [];
    
    for (var i = 0; i <= end; ++i) {
        var d = distPointLineseg(pointList[i], {p0:pointList[0], p1:pointList[end]});
        
        if ( d > dmax ) {
            index = i
            dmax = d
        }
        
        if (findCircs) {
            var circ = makeCircle(pointList[0], pointList[Math.floor(end/2)], pointList[end]);
            var dC = distancePtCircle(pointList[i], circ);
            
            if (dC > dCmax) {
                iC = i;
                dCmax = dC;
                iRad = circ.radius;
            }
        }
    }
    
    if (findCircs) {
        if ( dCmax < epsilon*2 && dmax > epsilon)
        {
            var midPt = pointList[Math.floor(end/2)];
            resultList.push(pointList[0]);
            resultList.push({ circleRad: iRad, x: midPt.x, y: midPt.y });
            resultList.push(pointList[end]);
            return resultList;
        }
    }
    
    // If max distance is greater than epsilon, recursively simplify
    if ( dmax > epsilon ) {
        // Recursive call
        var recResults1 = RamerDouglasPeucker(pointList.slice(0, index), epsilon);
        var recResults2 = RamerDouglasPeucker(pointList.slice(index,end), epsilon);
 
        // Build the result list
        resultList = recResults1;
        resultList = resultList.concat(recResults2);
    } else {
        resultList.push(pointList[0]);
        resultList.push(pointList[end]);
    }
    // Return the result
    return resultList;
}

