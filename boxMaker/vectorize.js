
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

// make a new pathSegment by starting at the passed in point and following
// each time a point is added to the segment, clear it from the thresh image
var followPath = function(ptOnPath, outpath, thresh, dirMap) {

    var pathSeg = new Path();
    outpath.pathSegments.push(pathSeg);
    
    var pt = ptOnPath;
    var pathStart = {x:pt.x, y:pt.y};
    
    pathSeg.ptdirs.push(pt);
    var next = followDirection(thresh, dirMap, pt);
    pt = next;
    
    while (pt.dir != DirectionEnum.Stop && 
        (pt.x != pathStart.x || pt.y != pathStart.y)) // we got back to the start
    {
        pathSeg.ptdirs.push(pt);
        var next = followDirection(thresh, dirMap, pt);
        pt = next;
    }
}

// iterate through the thresh image looking for a non zero
// return that x, y 
var findPointInThresh = function (thresh, dirMap)  {

    var i, j, nbrhd;
    
    for (i = 1; i < thresh.width-1; ++i)
    {
        for (j = 1; j < thresh.height-1; ++j)
        {
            if (thresh.getAt(i, j) > 0)
            {
                nbrhd = thresh.getEncodedNbrhd(i, j);
                dir = dirMap.nbrhdToDir(nbrhd);
                
                if (dir)
                    return { x:i, y:j, dir:dir };
            }
        }
    }
}


var clearPathSegmentFromThresh = function(pathSeg, thresh) {
    
    var i;
    for (i = 0; i < pathSeg.ptdirs.length; i++)
    {
        pt = pathSeg.ptdirs[i];
        thresh.setAt(pt.x, pt.y, 0);
    }
}

// todo, there must be a better way!
var findFirstPointNotInPathSegs = function(outpath) {
    
    var iPt, jPt, iSeg, curPt, curSeg, curSegPt, found;
    for (i = 0; i < outpath.ptdirs.length; ++i)
    {
        curPt = outpath.ptdirs[i];
        found = false;
        
        for (iSeg = 0; iSeg < outpath.pathSegments.length && !found; ++iSeg)
        {
            curSeg = outpath.pathSegments[iSeg];
            for (jPt = 0; jPt < curSeg.ptdirs.length && !found; ++jPt)
            {
                curSegPt = curSeg.ptdirs[jPt];
                if (curSegPt.x === curPt.x && curSegPt.y === curPt.y)
                {
                    found = true;
                }
            }
        }
        
        if (found === false)
            return curPt;
    }
}

// dist is an int that describes the threshold
// todo, extract vectorizeThresheldImage, maybe make an AcGrey2Image = AcBinaryImage
var vectorizeDistanceTrf = function(dt, dist, outpath)
{
    var dirMap = new DirectionMap(); // todo, how to make permanent to avoid reinit -make singleton
    var thresh = dt.copy();
    
    thresh.thresholdImage(dist*dist);
   
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
    
    if (outpath.ptdirs.length === 0)
        return;
    
    //  now lets try following the directions (ha!)
    
    var pt = findPointInThresh(thresh, dirMap);
    
    while (pt) {
        followPath(pt, outpath, thresh, dirMap);
        // clear that path from the thresh
        // potential issue - lots of short paths when we should have tracked the other way
        // todo: track backward and forward to make sure we get "full" paths
        //clearPathSegmentFromThresh(outpath.pathSegments[outpath.pathSegments.length -1], thresh);
        pt = findFirstPointNotInPathSegs(outpath);
        
        //pt = findPointInThresh(thresh, dirMap);
    }
    
}