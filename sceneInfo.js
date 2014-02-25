function SceneInfo() {

    this.points = [];
    this.preSelected = []; // idxs of preselected points
    
    // returns -1 if none, else the first one found 
    this.nearPointIdx = function (inPoint) {

        var ret = -1; 
        for (var idx = 0; idx < this.points.length && ret === -1; ++idx) {
            var point = this.points[idx];

            var distsq = (inPoint.x - point.x)*(inPoint.x - point.x) +
                (inPoint.y - point.y)*(inPoint.y - point.y);
            
            if (distsq < 100) {
                ret = idx;
            }
        }
        return ret;
    }
       
       
    this.getFirstPreSelectedPoint = function() {
        return this.points[this.preSelected[0]];
    }    
}



