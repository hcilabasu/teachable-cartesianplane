/******************************************************************************************/

var createRobot = function() {
  console.log("Robot...");

  var location = new Point(0,0);
  var orientation = 0;

  var markUnits = false;
  var pen = false;

  //speed parameters
  var distance = .25;
  var degrees = 10;

  var radius = 0.5;

  var changeColor = function(rbC,rcC,rdC,reC,rfC) {
    geoApp.setColor('C1', hexToR(rbC), hexToG(rbC), hexToB(rbC));
    geoApp.setColor('RB', hexToR(rbC), hexToG(rbC), hexToB(rbC));
    geoApp.setColor('RC', hexToR(rcC), hexToG(rcC), hexToB(rcC));
    geoApp.setColor('RD', hexToR(rdC), hexToG(rdC), hexToB(rdC));
    geoApp.setColor('RE', hexToR(reC), hexToG(reC), hexToB(reC));
    geoApp.setColor('RF', hexToR(rfC), hexToG(rfC), hexToB(rfC));
  };

  var fadeColor = function(rbC,rcC,rdC,reC,rfC,steps) {
    var count = 0;
    // RB
    var rb_stepR = (hexToR(geoApp.getColor('RB')) - hexToR(rbC)) / steps;
    var rb_stepG = (hexToG(geoApp.getColor('RB')) - hexToG(rbC)) / steps;
    var rb_stepB = (hexToB(geoApp.getColor('RB')) - hexToB(rbC)) / steps;
    // RC
    var rc_stepR = (hexToR(geoApp.getColor('RC')) - hexToR(rcC)) / steps;
    var rc_stepG = (hexToG(geoApp.getColor('RC')) - hexToG(rcC)) / steps;
    var rc_stepB = (hexToB(geoApp.getColor('RC')) - hexToB(rcC)) / steps;
    // RD
    var rd_stepR = (hexToR(geoApp.getColor('RD')) - hexToR(rdC)) / steps;
    var rd_stepG = (hexToG(geoApp.getColor('RD')) - hexToG(rdC)) / steps;
    var rd_stepB = (hexToB(geoApp.getColor('RD')) - hexToB(rdC)) / steps;
    // RE
    var re_stepR = (hexToR(geoApp.getColor('RE')) - hexToR(reC)) / steps;
    var re_stepG = (hexToG(geoApp.getColor('RE')) - hexToG(reC)) / steps;
    var re_stepB = (hexToB(geoApp.getColor('RE')) - hexToB(reC)) / steps;
    // RF
    var rf_stepR = (hexToR(geoApp.getColor('RF')) - hexToR(rfC)) / steps;
    var rf_stepG = (hexToG(geoApp.getColor('RF')) - hexToG(rfC)) / steps;
    var rf_stepB = (hexToB(geoApp.getColor('RF')) - hexToB(rfC)) / steps;


    //console.log('Starting Color:'+hexToR(geoApp.getColor('RB'))+','+hexToG(geoApp.getColor('RB'))+','+hexToB(geoApp.getColor('RB')));
    //console.log('Steps: '+rb_stepR+','+rb_stepG+','+rb_stepB);

    var fade = setInterval(function(){
        //console.log('Debug Steps (this):'+this.rb_stepR+','+this.rb_stepG+','+this.rb_stepB);
       // console.log('Debug Steps:'+rb_stepR+','+rb_stepG+','+rb_stepB);
        geoApp.setColor('C1', hexToR(geoApp.getColor('RB'))-rb_stepR, hexToG(geoApp.getColor('RB'))-rb_stepG, hexToB(geoApp.getColor('RB'))-rb_stepB);
        geoApp.setColor('RB', hexToR(geoApp.getColor('RB'))-rb_stepR, hexToG(geoApp.getColor('RB'))-rb_stepG, hexToB(geoApp.getColor('RB'))-rb_stepB);
        geoApp.setColor('RC', hexToR(geoApp.getColor('RC'))-rc_stepR, hexToG(geoApp.getColor('RC'))-rc_stepG, hexToB(geoApp.getColor('RC'))-rc_stepB);
        geoApp.setColor('RD', hexToR(geoApp.getColor('RD'))-rd_stepR, hexToG(geoApp.getColor('RD'))-rd_stepG, hexToB(geoApp.getColor('RD'))-rd_stepB);
        geoApp.setColor('RE', hexToR(geoApp.getColor('RE'))-re_stepR, hexToG(geoApp.getColor('RE'))-re_stepG, hexToB(geoApp.getColor('RE'))-re_stepB);
        geoApp.setColor('RF', hexToR(geoApp.getColor('RF'))-rf_stepR, hexToG(geoApp.getColor('RF'))-rf_stepG, hexToB(geoApp.getColor('RF'))-rf_stepB);
        //console.log('Next Color:'+hexToR(geoApp.getColor('RB'))+','+hexToG(geoApp.getColor('RB'))+','+hexToB(geoApp.getColor('RB')));
        count++;
        if (count == steps){
          clearInterval(fade);
        }
    },10)
  };

  /*
   * Extensions are existing points that are connected to the robot
   * through line segments. They rotate and move along with the robot.
   *
   * Extensions need to have:
   * - angleDelta (int) - Difference between robot's orientation and robot->point angle
   * - distance (double) - Distance between robot's center and point
   * - name (string) - Name of point being moved
   */
  var extensions = {};

  var makeEyes = function() {
    // Eye
    geoApp.evalCommand("E = (" + (location.x + xDist(radius, orientation)) + "," + (location.y + yDist(radius, orientation))+ ")");
    // Shell
    geoApp.evalCommand("G = (" + (location.x+xDist(radius+.01, orientation+190)) + "," + (location.y+yDist(radius+.01, orientation+190)) + ")");
    geoApp.evalCommand("H = (" + (location.x+xDist(radius+.02, orientation)) + "," + (location.y+yDist(radius+.02, orientation)) + ")");
    geoApp.evalCommand("I = (" + (location.x+xDist(radius+.01, orientation+170)) + "," + (location.y+yDist(radius+.01, orientation+170)) + ")");
    // Head
    geoApp.evalCommand("J = (" + (location.x+xDist(radius, orientation+30)) + "," + (location.y+yDist(radius, orientation+30)) + ")");
    geoApp.evalCommand("K= (" + (location.x+xDist(radius, orientation+330)) + "," + (location.y+yDist(radius, orientation+330)) + ")");
    // Antennas
    geoApp.evalCommand("L = (" + (location.x+xDist(radius+.1, orientation+15)) + "," + (location.y+yDist(radius+.1, orientation+15)) + ")");
    geoApp.evalCommand("M = (" + (location.x+xDist(radius+.2, orientation+45)) + "," + (location.y+yDist(radius+.2, orientation+45)) + ")");
    geoApp.evalCommand("O= (" + (location.x+xDist(radius+.1, orientation+345)) + "," + (location.y+yDist(radius+.1, orientation+345)) + ")");
    geoApp.evalCommand("P= (" + (location.x+xDist(radius+.2, orientation+315)) + "," + (location.y+yDist(radius+.2, orientation+315)) + ")");

    geoApp.registerObjectClickListener("E", "alertWasClicked");
  };

  var makeCenter = function() {
    geoApp.evalCommand("R = (" + location.x + "," + location.y + ")");
    geoApp.setLayer("R", 1);
    geoApp.registerObjectClickListener("R", "alertWasClicked");
  };

  var makeExtensions = function() {
    for (var i in extensions) {
      var ex = extensions[i];
      pointOrientation = orientation+ex.angleDelta == 360 ? 0 : orientation+ex.angleDelta;
      geoApp.evalCommand(ex.name + " = (" + (location.x + xDist(ex.distance, pointOrientation)) + "," +
                                            (location.y + yDist(ex.distance, pointOrientation))+ ")");
      geoApp.evalCommand("C" + ex.name + " = Segment[R," + ex.name  + "]");
      geoApp.evalCommand("SetLineStyle[C" + ex.name + ", 1]");
    };
  }

  var addExtension = function(pointName){
    var point = pF.getPoint(pointName);
    var robot = pF.getPoint("R");
    var angleDelta = angle(robot, point)-orientation;
    var distance = robot.distanceTo(point);
    var returnObject = {
      angleDelta : angleDelta,
      distance : distance,
      name : pointName
    };
    extensions[pointName] = returnObject;
    makeExtensions();
    return returnObject;
  }

  var getExtension = function(pointName){
    return extensions[pointName];
  }

  var removeExtension = function(pointName){
    if(extensions[pointName]){
      delete extensions[pointName];
      geoApp.deleteObject("C" + pointName);
    }
  }

  var show = function() {
    makeCenter();
    makeEyes();
    geoApp.evalCommand("C1 = Segment[R,E]");
    geoApp.evalCommand("RB = Circle[R, C1]");
    geoApp.registerObjectClickListener("RB", "alertWasClicked");
    makeExtensions();
  };

  var appReady = function () {
    if(geoApp != undefined)
      {
	console.log("geoApp: " + geoApp);
      show();
      }
    else
      setTimeout(r1.appReady, 50);
  };

  // Public object returned
  return {
    appReady: appReady,

    makeEyes: makeEyes,
    makeCenter: makeCenter,
    makeExtensions : makeExtensions,
    getExtension : getExtension,
    removeExtension : removeExtension,

    speed: function(name) {
      switch(name){
        case "move":             // Fall through;
        case "moveSinglePoint":
          return distance;
        default:
          return degrees;
      }
    },

    addExtension: addExtension,

    get location() { return location; },
    get orientation() { return orientation; },
    set location(loc) { location = loc; },
    set orientation(o) { orientation = o; }
  }

 var addClickListener = function(object, func) {
    geoApp.registerObjectClickListener(object, func);
  };
};

r1 = createRobot();

/**********************************************************************************/

var pF = (function() {
  console.log("Playing field...");

  var pointNum = 1;

   var drawLine = function(point1, point2)
   {
	var lineName = point1 + point2;
	geoApp.evalCommand(lineName + " = Segment[" + point1 + "," + point2 + "]");
  };

  var drawArc = function(point1, point2, point3){
    var arcName = point1 + point2 + point3;
    geoApp.evalCommand(arcName + " = CircularArc[" + point1 + "," + point2 + "," + point3 + "]");
  }

  var addClickListener = function(object, func) {
    geoApp.registerObjectClickListener(object, func);
  };

  var clearPlot = function(){
    pointNum = 1;
    var total = geoApp.getObjectNumber();
    var names = [];
    for (var i = 0; i < total; i++){
      var name = geoApp.getObjectName(i);
      names.push(name);
    }
    for (var i = 0; i < names.length; i++){
      deletePoint(names[i]);
    }
    // Re-creating robot
    r1 = createRobot();
    r1.appReady();
  }

  var getPoint = function(point) {
    if(point.constructor && point.constructor.getName() == "Point") return point;
    else return new Point(geoApp.getXcoord(point), geoApp.getYcoord(point));
  };

  var deletePoint = function(pointName) {
    geoApp.deleteObject(pointName);
  }

  var forceCreatePoint = function(point, funcName, name){
    var pName;
    if(name)
        pName = name;
    else
      pName = "P" + pointNum;

    geoApp.evalCommand(pName + " = (" + point.x + "," + point.y + ")");
    geoApp.setLayer(pName, 0);

    if(funcName)
    {
          addClickListener(pName, funcName);
    }
    pointNum++;

    return "P"+(pointNum-1);
  }

  var createPoint = function(point, funcName, name) {
//    console.log("In createPoint..." + point.x + "," + point.y);
    var exists = pointExists(point);

    if(exists)
      return exists;

    else
    {
      return forceCreatePoint(point, funcName, name);
    }
  };

  var pointExists = function(point)
  {
      var exists = null;

      //iterate all points
      for (var i = 0; i < geoApp.getObjectNumber() && !exists; i++)
      {
  	var name = geoApp.getObjectName(i);

  	if ("point" == geoApp.getObjectType(name)
  	    && 0 == geoApp.getLayer(name)
  	    && point.x == geoApp.getXcoord(name)
  	    && point.y == geoApp.getYcoord(name))
  	{
  	    exists = name;
  	}
      }

      return exists;
  };

  var appReady = function(points, lines) {
    if(geoApp)
    {
      if(points !== undefined){
        plotPointsAndLines(points, lines);
      } else {
        loadTest();
      }
    }
    else
      setTimeout(pF.appReady, 50);
  };

  var plotPointsAndLines = function(points, lines){
    console.dir(points);
    console.dir(lines);
    clearPlot();
    for(var i = 0; i < points.length; i++){
      var point = points[i];
      createPoint(new Point(point.x,point.y), "alertWasClicked", point.name);
    }
    for(var i = 0; i < lines.length; i++){
      var line = lines[i];
      drawLine(line.p1, line.p2);
    }
  }

  var loadTest = function() {
    setTimeout("geoApp.setCoordSystem(-6,6,-6,6)", 100);
    /*createPoint(new Point(6,0), "alertWasClicked", "X1");
    createPoint(new Point(-6,0), "alertWasClicked", "X2");
    createPoint(new Point(0,6), "alertWasClicked", "Y1");
    createPoint(new Point(0,-6), "alertWasClicked", "Y2");*/

    // >>>> Points <<<<

    // A
    createPoint(new Point(-4,-2), "alertWasClicked", "A1");
    createPoint(new Point(-3,2), "alertWasClicked", "A2");
    createPoint(new Point(-2,-2), "alertWasClicked", "A3");
    // S
    createPoint(new Point(1,2), "alertWasClicked", "S1");
    createPoint(new Point(0,2.5), "alertWasClicked", "S1S2");
    createPoint(new Point(-1,2), "alertWasClicked", "S2");
    createPoint(new Point(-1,0), "alertWasClicked", "S3");
    createPoint(new Point(1,0), "alertWasClicked", "S4");
    createPoint(new Point(1,-2), "alertWasClicked", "S5");
    createPoint(new Point(0,-2.5), "alertWasClicked", "S5S6");
    createPoint(new Point(-1,-2), "alertWasClicked", "S6");
    // U
    createPoint(new Point(2,2), "alertWasClicked", "U1");
    createPoint(new Point(2,-2), "alertWasClicked", "U2");
    createPoint(new Point(4,-2), "alertWasClicked", "U3");
    createPoint(new Point(4,2), "alertWasClicked", "U4");

    // >>>> Lines <<<<

    // A
    drawLine("A1", "A2");
    drawLine("A2", "A3");
    // S
    drawLine("S1", "S1S2");
    drawLine("S1S2", "S2");
    drawLine("S2", "S3");
    drawLine("S3", "S4");
    drawLine("S4", "S5");
    drawLine("S5", "S5S6");
    drawLine("S5S6", "S6");
    // U
    drawLine("U1", "U2");
    drawLine("U2", "U3");
    drawLine("U3", "U4");
    //drawLine("NEW", "P7");
    //if (parent.pFListener != null)
//	parent.pFListener.set();
  }

  return {
    get lastPointNum() { return pointNum - 1; },
    get currPointNum() { return pointNum; },

    getPoint: getPoint,
    createPoint: createPoint,
    forceCreatePoint: forceCreatePoint,
    drawLine: drawLine,
    drawArc: drawArc,
    deleteObject: deletePoint,

    addClickListener: addClickListener,

    appReady: appReady
  }
}());

/*************************************************************************************/

var geoApp;
var ready = function()
{
  if(document.applets[0] != null && document.applets[0].isActive)
  {
    console.log("Applet ready...");
    geoApp = document.ggbApplet;
    //document.onclick = appletClicked;
  }
  else
  {
    console.log("Applet not yet loaded...");
    setTimeout(ready, 10000);
  }
};

ready();
r1.appReady();
pF.appReady();

var appletClicked = function()
{
    alertWasClicked(null)
}

/********************************************************************************/

/*var alertWasClicked = function(clickedObject)
{
  console.log(clickedObject + " was clicked");
  //parent.alertWasClicked(clickedObject);
  //controller.addAction(new Action("goTo", clickedObject));
}*/

