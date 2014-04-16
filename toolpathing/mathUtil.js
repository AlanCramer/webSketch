


var distPtPt = function (p0, p1) {
    return Math.sqrt( (p1.x-p0.x)*(p1.x-p0.x) + (p1.y-p0.y)*(p1.y-p0.y));
}

// lineSeg = {p0, p1} where each pi = {x, y}
var distPointLineseg = function (pt, lineseg) {

    var line = makeLineBy2Pts(lineseg.p0, lineseg.p1);
    var dline = distPointLine(pt, line);
    var dp0 = distPtPt(pt, lineseg.p0);
    var dp1 = distPtPt(pt, lineseg.p1);

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
// todo : error handling
var makeLineBy2Pts = function (pt0, pt1) {

    var a = pt0.y - pt1.y;
    var b = pt1.x - pt0.x;
    var c = pt0.x*pt1.y - pt1.x*pt0.y;
    
    return {a:a,b:b,c:c};
}

var makeMidPt = function (p0, p1) {
    return { x:(p0.x + p1.x)/2, y:(p0.y + p1.y)/2 };
}

// line has form ax+by+c=0
// todo : error handling
var makePerpBisectLine = function (p0, p1) {

    var bisectPt = makeMidPt;

    // rotate p1 (or p0) 90deg about bisectPt
    // translate bisectPt to origin, multiply by 2x2 [0 -1, 1 0], and add back on bisectPt
    // I get, for (c,d) 90 about (a, b), I get (b+a-d, c+b-a)
    // so for p1 90 about bisectPt
    var otherPt = {x:bisectPt.y + bisectPt.x -p1.y, y:p1.x + bisectPt.y - p1.x};
    
    return makeLineBy2Pts(bisectPt, otherPt);
}


// circle with center = {x,y} and radius 
// a, b, c are points with {x, y}
var makeCircleBy3Pts = function (a, b, c) {

    var tmp = 2*(a.x*(b.y-c.y) + b.x*(c.y-a.y) + c.x*(a.y - b.y));
    var cx = ((a.x*a.x + a.y*a.y)*(b.y-c.y) + (b.x*b.x + b.y*b.y)*(c.y-a.y) + (c.x*c.x+c.y*c.y)*(a.y-b.y))/tmp;
    var cy = ((a.x*a.x + a.y*a.y)*(c.x-b.x) + (b.x*b.x + b.y*b.y)*(a.x-c.x) + (c.x*c.x+c.y*c.y)*(b.x-a.x))/tmp;

    
    var lenABsq = (b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y);
    var lenBCsq = (b.x-c.x)*(b.x-c.x) + (b.y-c.y)*(b.y-c.y);
    var lenCAsq = (c.x-a.x)*(c.x-a.x) + (c.y-a.y)*(c.y-a.y);

    var diamNum = 2*Math.sqrt(lenABsq * lenBCsq * lenCAsq);
    
    var lenAB = Math.sqrt(lenABsq);
    var lenBC = Math.sqrt(lenBCsq);
    var lenCA = Math.sqrt(lenCAsq);

    var diamDenomSq = (lenAB+lenBC+lenCA)*(-lenAB+lenBC+lenCA)*(lenAB-lenBC+lenCA)*(lenAB+lenBC-lenCA);
    var diamDenom = Math.sqrt(diamDenomSq);
    
    var diam = diamNum/diamDenom; 
    
    return { center : {x:cx, y:cy}, radius : diam/2 };
}

var distancePtCircle = function (pt, cir)
{
    var cc = cir.center;
    var dsq = (pt.x - cc.x)*(pt.x - cc.x) + (pt.y - cc.y)*(pt.y - cc.y);
    
    var d = Math.sqrt(dsq);
    
    return Math.abs(d - cir.radius);
}

// intersect the circle with the line through p0 and p1.
// return two solutions, as array of pts
var intersectLineCircle = function (p0, p1, c)
{
    var tol = 1e-6;
    if (distPtPt(p0, p1) < tol  
        || c.radius < tol) {
        return false;
    }

    var cx = c.center.x;
    var cy = c.center.y;
    var cr = c.radius;

    var a = Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y-p0.y, 2);
    var b = 2*(p1.x - p0.x)*(p0.x - cx) + 2*(p1.y - p0.y)*(p0.y - cy);
    var c = Math.pow(p0.x - cx, 2) + Math.pow(p0.y - cy, 2) - Math.pow(cr, 2);

    var bb4ac = b*b - 4*a*c;
    if (bb4ac < 0) {
        return false;
    }
    
    var d = Math.sqrt(bb4ac);

    var t0 = (-b + d)/(2*a);
    var t1 = (-b - d)/(2*a);

    var xt0 = (p1.x - p0.x)*t0 + p0.x;
    var yt0 = (p1.y - p0.y)*t0 + p0.y;

    var xt1 = (p1.x - p0.x)*t1 + p0.x;
    var yt1 = (p1.y - p0.y)*t1 + p0.y;

    // return two solutions s0 and s1
    return [{x:xt0, y:yt0}, {x:xt1, y:yt1}];
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

