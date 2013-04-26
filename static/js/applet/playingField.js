function PlayingField()
{
    this.pointNum = 1;
    
    this.xMin = -6.0;
    this.xMax = 6.0;
    this.yMin = -6.0;
    this.yMax = 6.0;
    
//    geoApp.evalCommand("ZoomIn[" + this.xMin + "," + this.xMax + "," + this.yMin + "," + this.yMax + "]");
//    geoApp.setCoordSystem(this.xMin, this.xMax, this.yMin, this.yMax);
    this.addAxPoints();
    
//    setTimeout("pF.createAxes()", 10000);
   // geoApp.registerAddListener("addClickListener");
}

PlayingField.prototype.addClickListener = function(addedObject)
{
    console.log("addClickListener to " + addedObject);
    console.log(geoApp.registerObjectClickListener(addedObject, "alertWasClicked"));
}

addToForm = function(clickedObject)
{
    
}

alertWasClicked = function(clickedObject)
{
  controller.addAction(new Action("goTo", clickedObject));
   console.log(clickedObject + " was clicked");
}

PlayingField.prototype.getPoint = function(point)
{
  if(point.constructor == Point) return point;
  else return new Point(geoApp.getXcoord(point), geoApp.getYcoord(point));
}

PlayingField.prototype.createPoint = function(xCoord, yCoord)
{
    var exists = this.pointExists(xCoord,yCoord);
    if (exists)
	return exists;
    else
    {
	geoApp.evalCommand("P" + this.pointNum + " = (" + xCoord + "," + yCoord + ")");
	geoApp.setLayer("P" + this.pointNum, 0);
	
	console.log("dealing with object: " + geoApp.getObjectType("P" + this.pointNum));
	
	this.addClickListener("P" + this.pointNum);

	// making it invisible for smoothness
	//geoApp.setVisible("P"+this.pointNum, false);

	this.pointNum++;
	

	return "P"+(this.pointNum-1);
    }
}

PlayingField.prototype.pointExists = function(xCoord, yCoord)
{
    console.log("PlayingField pointExists...");
    var exists = null;
    //iterate all points
    for (var i = 0; i < geoApp.getObjectNumber() && !exists; i++)
    {
	var name = geoApp.getObjectName(i);

	if ("point" == geoApp.getObjectType(name) 
	    && 0 == geoApp.getLayer(name)
	    && xCoord == geoApp.getXcoord(name)
	    && yCoord == geoApp.getYcoord(name))
	{	  
	    exists = name;
	}
    }
    
    return exists;
}

PlayingField.prototype.createLine = function(p1, p2)
{
}  

PlayingField.prototype.getLastPointNum = function()
{
    return (this.pointNum - 1);
}


PlayingField.prototype.getCurrPointNum = function()
{
    return this.pointNum;
}

PlayingField.prototype.addAxPoints = function()
{

  
  geoApp.setCoordSystem(this.xMin, this.xMax, this.yMin, this.yMax);



  this.createPoint(this.yMin, 0);
  this.createPoint(this.yMax, 0);
  this.createPoint(0, this.xMin);
  this.createPoint(0, this.xMax);
}

PlayingField.prototype.createAxes = function()
{
  geoApp.evalCommand("X = Line[P1,(3,0)]");
  geoApp.evalCommand("Y = Line[P1,(0,3)]");
}