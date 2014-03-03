

// g(i) = G(i, y) for some fixed y
// Sep(i, u) = (u^2 - i^2 +g(u)^2-g(i)^2) div (2(u-i))  where div is integer division
//  int Sep(const AcImage& G, unsigned int y, int i, int u)
function Sep(G, y, i, u)
{
    return (u*u - i*i + G.getAt(u,y)*G.getAt(u,y) - G.getAt(i, y)*G.getAt(i, y)) / (2*(u-i));
}

// f using EDT is: f(x, i) = (x-i)^2 + g(i)^2
//int EDT_f(const AcImage& G, unsigned int y, int x, int i)
function EDT_f(G, y, x, i)
{
    return (x-i)*(x-i) + G.getAt(i,y)*G.getAt(i,y);
}

//void DistTransUtil::ComputeDistTrans(const AcImage &in, AcImage &dt)
function computeDistTrans(inGreyImg, g)
{
    // var g = $.extend(true, {}, inGreyImg); // deep copy

    m = inGreyImg.width;
    n = inGreyImg.height;

    var maxGVal = m + n;

    // phase 1 - define g(i,j)
    //  todo - this seems wrong if w or h is pretty large.
    //         distances can get too large to store in AcImage's unsigned chars.

    //  todo - last column is uninitialized, what should it be?
    for (var i = 0; i < m; ++i)
    {
        // todo why is this a ref error (invalid lhs) ? g.getAt(i, 0) = ...
        //g.data[i] = (inGreyImg.getAt(i, 0) === 0) ? 0 : maxGVal;
        g.data[i] = 128;
        
        for (var j = 1; j < n; ++j)
        {
            g.data[j * g.width + i] = (inGreyImg.getAt(i,j) == 0) ? 0 : 1 + g.getAt(i, j-1);
        }

        for (var j = n - 1; j >= 0; --j)
        {
            if (g.getAt(i, j+1) < g.getAt(i,j))
            {
                g.data[j * g.width + i] = 1 + g.getAt(i, j+1);
            }
        }
    }
    
    
}
/*
    // Phase 2
    // need f and Sep (defined above)

    // todo, this loop could be parallelized
    for (unsigned int j = 0; j < n; ++j)
    {
        int q = 0;
        int s[m];
        int t[m];
        s[0] = t[0] = 0;

        for (unsigned int u = 1; u < m; ++u)
        {
            while (q >=0 && EDT_f(g, j, t[q], s[q]) > EDT_f(g, j, t[q], u))
            {
                --q;
            }

            if (q < 0)
            {
                q = 0;
                s[0] = u;
            }
            else
            {
                int w = 1 + Sep(g, j, s[q], u);
                if (w < 0 || (unsigned) w < m) // is w <0 possible?
                {
                    ++q;
                    s[q] = u;
                    t[q] = w;
                }
            }
        }

        for (int u = m; u >=0; --u)
        {
            dt(u, j) = EDT_f(g, j, u, s[q]);
            if (u == t[q])
            {
                --q;
            }
        }
    }
}
*/
