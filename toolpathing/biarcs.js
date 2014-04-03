
// Yang Du, Numerical Methods for Approx. digitized curves by piecewise circular arcs

// D = delta = {V_1, ... , V_n }

// This is E_inf(D, G), the max dist to the circ of all the pts
circToPtsErr = function(ptArr, circle) {

    var maxErr = 0;
    
    for (var i = 0; i < ptArr.length; ++i) {

        // e_i(m) = min {d(V_i, P): P in G_m}
        var curErr = distancePtCircle(ptArr[i], circle)

        if (curErr > maxErr)
            maxErr = curErr;
    }
    
    return maxErr;
}

// todo: currently requires transform to (-a,0) (0,m) (a,0)
reduceInterval = function (ptArr, mmin, ma, mb, mmax) {

    var ret = {min:mmin, max:mmax};
    var circ_ma = makeCircleBy3Pts(ptArr[0], {x:0, y:ma}, ptArr[ptArr.length-1]);
    var circ_mb = makeCircleBy3Pts(ptArr[0], {x:0, y:mb}, ptArr[ptArr.length-1]);
    
    var err_a = circToPtsErr(ptArr, circ_ma);
    var err_b = circToPtsErr(ptArr, circ_mb);

    var tol = .0001; // todo - where to store, what value appropriate
    
    if (Math.abs(err_a - err_b) < tol) {
        ret.min = ma;
        ret.max = mb;
        return ret;
    }
    
    if (err_a < err_b) {
        ret.max = mb;
        return ret;
    }
    
    if (err_a > err_b) {
        ret.min = ma;
        return ret;
    }
}

findMminMmax = function(ptArr) {

    var last = ptArr.length-1;
    var st = ptArr[0];
    var en = ptArr[last];
    var mmin, mi, mmax;
    var circ;
    
    mmin = Number.MAX_VALUE;
    mmax = Number.MIN_VALUE;

    for (var i = 1; i < last; ++i) {
        circ = makeCircleBy3Pts(st, ptArr[i], en);
        
        mi = circ.center.y + circ.radius;
        
        if (mi < mmin)
            mmin = mi;
            
        if (mi > mmax)
            mmax = mi;
    }
    
    return {min:mmin, max:mmax};
}

// find circ that minimizes max E_inf dist from ptArr
// todo: requires ptArr[0] = (-a, 0) and ptArr[end] = (a, 0)
findBestCircleFit = function(ptArr, epsilon) {

    var intvl = findMminMmax(ptArr);
    var ma, mb;
    var d = (intvl.max - intvl.min);
    
    while ( d > epsilon) {
        
        ma = d/3 + intvl.min;
        mb = 2*d/3 + intvl.min;
        intvl = reduceInterval(ptArr, intvl.min, ma, mb, intvl.max);
        d = (intvl.max - intvl.min);
    }
    
    var mbar = (intvl.max + intvl.min)/2;
    return makeCircleBy3Pts(ptArr[0], {x:0, y:mbar}, ptArr[ptArr.length - 1]);
}



