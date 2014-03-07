
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
}