/***********************************************************************
*
* Defines a Robot "class"
*
* location - the location of the robot
* orientation - the orientation of the robot
* 
* optional parameters:
*
* markUnits
* pen
*
* prototype methods:
*
* show
* makeCenter
* makeEyes
*
***********************************************************************/

function Robot(location, orientation, markUnits, pen)
{
    this.location = location;
    this.orientation = orientation;

    this.markUnits = markUnits || false;
    this.pen = pen || false;
    
    //speedParameters
    this.distance = .25;
    this.degrees = 10;
    this.speed = 50;
    
    this.radius = 0.5;
    this.origin = "";
    this.curr = "";
    
}

Robot.prototype = {
  get dist(){ return this.distance; },
  set dist(newDist){ this.distance = newDist; },
  
  get deg(){ return this.degrees; },
  set deg(newDeg){ this.degrees = newDeg; }
}

Robot.prototype.show = function()
{
//    pF.createPoint(this.location.x, this.location.y);
//    this.makeCenter(this.location.x, this.location.y);
    this.makeCenter();
    this.makeEyes();

//    geoApp.evalCommand("E = (" + (this.location.x + .5) + "," + this.location.y + ")");
    geoApp.evalCommand("C1 = Segment[R,E]");
    geoApp.evalCommand("RB = Circle[R, C1]");
//  geoApp.evalCommand("RB = Circle[P" + pF.getLastPointNum() + ", C1]");
}

Robot.prototype.makeCenter = function()
{
    console.log("makeCenter");
    geoApp.evalCommand("R = (" + this.location.x + "," + this.location.y + ")");
    //geoApp.setLabelVisible("R",false);
    //geoApp.setVisible("R", false);
    geoApp.setLayer("R", 1);
}

Robot.prototype.makeEyes = function()
{
    console.log("makeEyes");
    geoApp.evalCommand("E = (" + (this.location.x + xDist(this.radius, this.orientation)) + "," + (this.location.y + yDist(this.radius, this.orientation))+ ")");
 //   geoApp.evalCommand("C1 = Segment[R,E]");
}

