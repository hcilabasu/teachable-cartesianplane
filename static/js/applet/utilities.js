function Point(x,y)
{
    this.x = x;
    this.y = y;
}

Point.prototype.constructor = Point;

Point.prototype.distanceTo = function(otherPoint)
{
    return Math.sqrt(Math.pow(otherPoint.x - this.x, 2) 
		     + Math.pow(otherPoint.y -this.y , 2)); 
}

Point.prototype.equals = function(otherPoint)
{
  if(otherPoint == null) return false;
  if(!(otherPoint instanceof Point)) return false;
  
  return this.x == otherPoint.x && this.y == otherPoint.y;
}

/*
 * Inverts the angle if the invert param is < 0
 */
function invertAngle(angle, invert){
  if(invert < 0) {
    return angle - 180;
  } else {
    return angle;
  }
}

function angle(point1, point2){
  var dX = point2.x - point1.x;
  var dY = point2.y - point1.y;
  var result = Math.atan2(dY, dX)*180/Math.PI;
  return result < 0 ? result + 360 : result;
}

/** Given an angle in degrees, returns the angle in radians. */
function dtr(degrees)
{
    return degrees * Math.PI / 180;
}

function rtd(radians)
{
    return radians * 180 / Math.PI;
}

/** Given a distance to travel and an orientation, returns the horizontal distance. */
function xDist(distance, orientation)
{
    var radians = dtr(orientation);
    
    // correction for weird decimal error
    if (orientation == 90 || orientation == 270)
	return 0;
   else
	return distance*Math.cos(radians);
}

function yDist(distance, orientation)
{
    var radians = dtr(orientation);

    // correction for weird decimal error
    if (orientation == 0 || orientation == 180)
	return 0;
    else
	return distance*Math.sin(radians);
}

function submitenter(myfield,e)
{
    var keycode;
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
    else return true;

    if (keycode == 13)
    {
	myfield.form.submit();
	return false;
    }
    else
	return true;
}

function makeName(origin, center)
{
    originNum = origin.substring(1);
    centerNum = center.substring(1);
    if (parseFloat(originNum) <= parseFloat(centerNum))
	return origin + center;
    else
	return center + origin;
}

Function.prototype.getName = function() {
  if("name" in this) return this.name;
  return this.name = this.toString().match(/function\s*([^(]*)\(/)[1];
};

/***********************************************************************
*
* Defines an Action "class"
*
* name - defines the name of the action; used to call action method
* op - the operand
*
***********************************************************************/

function Action(name, op, callback)
{
  this.name = name;
  this.op = op;
  this.callback = callback;
}