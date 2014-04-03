
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

// currently requires transform to (-a,0) (0,m) (a,0)
reduceInterval = function (ptArr, mmin, ma, mb, mmax) {

    var ret = {min:mmin, max:mmax};
    var circ_ma = makeCircle(ptArr[0], {x:0, y:ma}, ptArr[ptArr.length-1]);
    var circ_mb = makeCircle(ptArr[0], {x:0, y:mb}, ptArr[ptArr.length-1]);
    
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





