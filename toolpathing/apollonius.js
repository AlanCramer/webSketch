
// returns the 8 circles tangent to the 3 input circles
//
// circles are objects with center (2d point, object with x and y) and radius
//

// assumes real solutions
solveQuadratic = function (a, b, c) {

    var det = b*b - 4*a*c;
    
    if (det < 0)
        return undefined;
    
    var term = Math.sqrt(det);
    var ret = {};
    
    ret.s0 = (-b + term)/ (2*a);
    ret.s1 = (-b - term)/ (2*a);
    
    return ret;
}

findApolloniusCircles = function (c1, c2, c3) {

    // see Maier thesis, 2010, p.29
    
    // solve 
    //   (A)  a0x + b0y + c0r = d0, and 
    //   (B)  a1x + b1y + c1r = d1
    //
    // where a0 = 2(x1 - x2), b0 = 2(y1 - y2), c0 = 2(+- r1 +- r2), 
    // and d0 = (x1^2 + y1^2 - r1^2) - (x2^2 + y2^2 - r2^2)
    // same for a1, b1, c1, d1 where '2' is replaced with '3'
    
    // so ... if (c0 != 0) solve (A) for r in terms of x and y (C)
    // substitute into (B), if (b1 != 0) solve for y in terms of x (D)
    // sub (D) into (C) to have (E) r = fx+g and (D) y = hx+i
    
    // finally solve (F) (x-x1)^2 + (y-y1)^2 - (r+-r1)^2 = 0 for x
    //
    //   (C) r = (d0- a0x - b0y)/c0
    //   (D) y = (d1 - c1r - a1x)/b1 = (d1 - (c1/c0)(d0 - a0x - b0y) - a1x)/b1
    //       solve for y ... 
    //   (E) r = (d0 - a0x - b0( ...
    
    // So I get y = (1/(c0b1+c1b0))[(d1c0-c1d0) + (c1a0-c0a1) x ]
    // And with (C), r(x) = ...
    //  
    // Now this needs to go back into (x-x1)^2 + (y-y1)^2 - (r+-r1)^2 = 0
    
    var x1 = c1.center.x;
    var x2 = c2.center.x;
    var x3 = c3.center.x;
    var y1 = c1.center.y;
    var y2 = c2.center.y;
    var y3 = c3.center.y;
    var r1 = c1.radius;
    var r2 = c2.radius;
    var r3 = c3.radius;

    var a0 = 2*(x1-x2);
    var b0 = 2*(y1-y2);
    var c0 = 2*(r1-r2);  // actually there are 4 of these: todo 
    var d0 = x1*x1 + y1*y1 - r1*r1 - x2*x2 - y2*y2 + r2*r2;
 
    var a1 = 2*(x1-x3);
    var b1 = 2*(y1-y3);
    var c1 = 2*(r1-r3);  // actually there are 4 of these: todo 
    var d1 = x1*x1 + y1*y1 - r1*r1 - x3*x3 - y3*y3 + r3*r3;
    
    // asymmetry with signs worries me here...
    var den = c0*b1 + c1*b0;
    var q = (d1*c0 - c1*d0);
    var qh = q/den - y1;
    var s = (d0*b1 - b0*d1);
    var sh = s/den - r1; // two of these: todo
    var r = (c1*a0 - c0*a1)/den;
    var t = (a0*b1 + b0*a1)/den;
    
    var aq = 1 + r*r + t*t;
    var bq = 2*(sh*t + qh*r-x1);
    var cq = x1*x1+qh*qh+sh*sh;
    
    var sln = solveQuadratic(aq, bq, cq);
    
    if (!sln)
        return undefined;
        
    var cx = sln.so;
    var cy = q+r*cx;
    var cr = s+t*cx;
    
    var ans = [];
    var cir = { center: {x:cx, y:cy}, radius: cr };
    ans.push(cir);
 }


