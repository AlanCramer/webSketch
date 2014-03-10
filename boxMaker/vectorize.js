
var followDirection = function (thresh, dirMap, pt) {
    
    var pos = {x:pt.x, y:pt.y};
    
    switch (pt.dir)
    {
        case DirectionEnum.North:
            pos.y--;
            break;
        case DirectionEnum.East:
            pos.x++;
            break;
        case DirectionEnum.South:
            pos.y++;
            break;
        case DirectionEnum.West:
            pos.x--;
            break;
        default:
            assert("what?");
    }
    
    var nbrhd = thresh.getEncodedNbrhd(pos.x, pos.y); 
    var nextDir = dirMap.nbrhdToDir(nbrhd);
    
    return { x: pos.x, y:pos.y, dir:nextDir }
}

// dist is an int that describes the threshold
// todo, extract vectorizeThresheldImage, maybe make an AcGrey2Image = AcBinaryImage
var vectorizeDistanceTrf = function(dt, dist, outpath)
{
    var dirMap = new DirectionMap(); // todo, how to make permanent to avoid reinit -make singleton
    var thresh = dt.copy();
    
    thresh.thresholdImage(dist);
   
    var nw, nn, ne, ee, cc, ww, sw, ss, se, ennb, i, j, dir, nbrhd;

    for (i = 1; i < thresh.width-1; ++i)
    {
        for (j = 1; j < thresh.height-1; ++j)
        {
            nbrhd = thresh.getEncodedNbrhd(i, j); 

            dir = dirMap.nbrhdToDir(nbrhd);
            
            if (dir && dir != DirectionEnum.Stop) {
            
                var ptdir = { x:i, y:j, dir:dir };
                outpath.ptdirs.push(ptdir);
            }
        }
    }
    
    if (outpath.ptdirs.length == 0)
        return;
    
    //  now lets try following the directions (ha!)
    var pathSeg = new Path();
    outpath.pathSegments.push(pathSeg);
    
    var pt = outpath.ptdirs[0];
    var pathStart = {x:pt.x, y:pt.y};
    
    pathSeg.ptdirs.push(pt);
    pt.visited = true;
    var next = followDirection(thresh, dirMap, pt);
    pt = next;

    while (pt.dir != DirectionEnum.Stop && 
        (pt.x != pathStart.x || pt.y != pathStart.y)) // we got back to the start
    {
        pathSeg.ptdirs.push(pt);
        pt.visited = true;
        var next = followDirection(thresh, dirMap, pt);
        pt = next;
    }
    
}