/******************************************************************************************/

var createRobot = function() {
  console.log("Robot...");

  var location = new Point(0,0);
  var orientation = 0;

  var markUnits = false;
  var pen = false;
    
  //speed parameters
  console.log("Changing distance from 0.25 to 1 just to check the pause functionality");
  var distance = 1//0.25;
  var degrees = 10;
    
  var radius = 0.5;

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
    geoApp.evalCommand("E = (" + (location.x + xDist(radius, orientation)) + "," + (location.y + yDist(radius, orientation))+ ")");
    geoApp.registerObjectClickListener("E", "alertWasClicked");
    geoApp.setLabelVisible("E", false);
  };
  
  var makeCenter = function() {
    geoApp.evalCommand("R = (" + location.x + "," + location.y + ")");
    geoApp.setLayer("R", 1);
    geoApp.registerObjectClickListener("R", "alertWasClicked");
    geoApp.setLabelVisible("R", false);
  };

  var makeExtensions = function() {
    for (var i in extensions) {
      var ex = extensions[i];
      pointOrientation = orientation+ex.angleDelta == 360 ? 0 : orientation+ex.angleDelta;
      var newX = location.x + xDist(ex.distance, pointOrientation);
      var newY = location.y + yDist(ex.distance, pointOrientation);
      geoApp.evalCommand(ex.name + " = (" + newX.toFixed(15) + "," + newY.toFixed(15) + ")");
      geoApp.evalCommand("C" + ex.name + " = Segment[R," + ex.name  + "]");
      geoApp.evalCommand("SetLineThickness[C" + ex.name + ", 6]");
    };
  }

  var addExtension = function(pointName) {
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

  var getExtension = function(pointName) {
    return extensions[pointName];
  }

  var removeExtension = function(pointName) {
    if(extensions[pointName]) {
      delete extensions[pointName];
      geoApp.deleteObject("C" + pointName);
    }
  }

// To Draw Crossing Lines along with the robots movement
  var makeCrosshair = function(){
    geoApp.evalCommand("CR1 = (" + (location.x) + "," + 150 + ")");
    geoApp.evalCommand("CR2 = (" + 150 + "," + (location.y)+ ")");
    geoApp.setLabelVisible("CR1", false);
    geoApp.setLabelVisible("CR2", false);
    geoApp.evalCommand("L1 = Line[R,CR1]");
    geoApp.evalCommand("L2 = Line[R,CR2]");
  }
  
  var show = function() {

    makeCenter();
    makeEyes();
    geoApp.evalCommand("C1 = Segment[R,E]");
    geoApp.evalCommand("RB = Circle[R, C1]");
    geoApp.registerObjectClickListener("RB", "alertWasClicked");
    makeExtensions();
    if(PAUSEENABLED)
    {
      makeCrosshair();
    }
  };
    
  var appReady = function () {
    if(geoApp != undefined) {
      console.log("geoApp: " + geoApp);
      show();

      stopDragMode();
    }
    else {
      setTimeout(r1.appReady, 50);
    }
  };

  // Public object returned
  return {
    appReady: appReady,
    show: show,
    makeEyes: makeEyes,
    makeCenter: makeCenter,
    makeExtensions : makeExtensions,
    getExtension : getExtension,
    removeExtension : removeExtension,
    makeCrosshair : makeCrosshair,

    speed: function(name) {
      switch(name){
        case "move":             // Fall through;
        case "moveSinglePoint":
          return distance;
        case "turn":             // Fall through;
        case "turnSinglePoint": 
          return degrees;
      }
    },    

    addExtension: addExtension,

    get location() {return location;},
    get orientation() {return orientation;},
    set location(loc) {location = loc;},
    set orientation(o) {orientation = o;}
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
  
  var drawLine = function(point1, point2) {
    var lineName = point1 + point2;
    geoApp.evalCommand(lineName + " = Segment[" + point1 + "," + point2 + "]");
  };

  var drawArc = function(point1, point2, point3) {
    var arcName = point1 + point2 + point3;
    geoApp.evalCommand(arcName + " = CircularArc[" + point1 + "," + point2 + "," + point3 + "]");
  }

  var addClickListener = function(object, func) {
    geoApp.registerObjectClickListener(object, func);
  };

  var clearPlot = function() {
    pointNum = 1;
    var total = geoApp.getObjectNumber();
    var names = [];
    
    for (var i = 0; i < total; i++) {
      var name = geoApp.getObjectName(i);
      names.push(name);
    }

    for (var i = 0; i < names.length; i++) {
      deletePoint(names[i]);
    }

    // Re-creating robot
    r1 = createRobot();
    r1.appReady();
  }
  
  var getPoint = function(point) {
    console.log("getPoint, point : " + JSON.stringify(point));

    if(point.constructor && point.constructor.getName() == "Point") {
      // console.log("first if");
      return point;
    }
    else {
      // console.log("second if");
      var tmpPoint = new Point(geoApp.getXcoord(point), geoApp.getYcoord(point));
      // console.log("tmpPoint : " + JSON.stringify(tmpPoint));
      return tmpPoint;
    }
  };
  
  var deletePoint = function(pointName) {
    geoApp.deleteObject(pointName);
  }

  var forceCreatePoint = function(point, funcName, name) {
    var pName;
    if(name) {
      pName = name;
    }
    else {
      pName = "P" + pointNum;
    }

    geoApp.evalCommand(pName + " = (" + point.x + "," + point.y + ")");
    geoApp.setLayer(pName, 0);
    
    if(funcName) {
      addClickListener(pName, funcName);      
    }

    pointNum++;       
    
    return "P"+(pointNum-1);
  }

  var createPoint = function(point, funcName, name) {
   // console.log("In createPoint..." + point.x + "," + point.y);
    var exists = pointExists(point);
    
    if(exists) {
      return exists;
    }
    else {
      return forceCreatePoint(point, funcName, name);
    }  
  };
  
  var pointExists = function(point) {
    var exists = null;
      
    //iterate all points
    for (var i = 0; i < geoApp.getObjectNumber() && !exists; i++) {
      var name = geoApp.getObjectName(i);

      if("point" == geoApp.getObjectType(name) && 0 == geoApp.getLayer(name) && point.x == geoApp.getXcoord(name) && point.y == geoApp.getYcoord(name)) {	  
        exists = name;
      }
    }
      
    return exists;
  };

  var lock = true; // Determines if objects are locked or not
  var draggingEnabled = false; // Determines if lock should be taken in consideration

  var isLocked = function() {
    return lock;
  }

  var lockObjects = function() {
    if(!draggingEnabled){
      setLock(true);
    }
  }

  var unlockObjects = function() {
    if(!draggingEnabled){
      setLock(false);
    }
  }

  var setLock = function(setLock) {
    lock = setLock;
    for(var i = 0 ; i < geoApp.getObjectNumber() ; i++) {
      var name = geoApp.getObjectName(i);
      geoApp.evalCommand("SetFixed["+name+","+setLock+"]");
    }
  }

  var setLockEnabled = function(setDragEnabled){
    draggingEnabled = setDragEnabled;
    setLock(!setDragEnabled);
  }
  
  var appReady = function(points, lines, robotLocation) {
    if(geoApp) {
      if(points !== undefined) {
        plotPointsAndLines(points, lines);
      }
      else {
        loadTest();
      }
      if(Object.getOwnPropertyNames(robotLocation).length > 0) {
        // Set robot's starting location
        r1.location.x = robotLocation.x;
        r1.location.y = robotLocation.y;
        r1.show();
      }
      pF.lockObjects();
    }
    else {
      setTimeout(pF.appReady, 50);
    }
  };
  
  var plotPointsAndLines = function(points, lines) {
    console.dir(points);
    console.dir(lines);
    clearPlot();
    
    for(var i = 0; i < points.length; i++) {
      var point = points[i];
      createPoint(new Point(point.x,point.y));//, "alertWasClicked"); // uncomment second half of line to enable point clicking
    }

    for(var i = 0; i < lines.length; i++) {
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

    createPoint(new Point(5,5));
    createPoint(new Point(-5,5));
    createPoint(new Point(-5,-5));
    createPoint(new Point(5,-5));

    // A
    // createPoint(new Point(-4,-2), "alertWasClicked", "A1");
    // createPoint(new Point(-3,2), "alertWasClicked", "A2");
    // createPoint(new Point(-2,-2), "alertWasClicked", "A3");
    // // S
    // createPoint(new Point(1,2), "alertWasClicked", "S1");
    // createPoint(new Point(0,2.5), "alertWasClicked", "S1S2");
    // createPoint(new Point(-1,2), "alertWasClicked", "S2");
    // createPoint(new Point(-1,0), "alertWasClicked", "S3");
    // createPoint(new Point(1,0), "alertWasClicked", "S4");
    // createPoint(new Point(1,-2), "alertWasClicked", "S5");
    // createPoint(new Point(0,-2.5), "alertWasClicked", "S5S6");
    // createPoint(new Point(-1,-2), "alertWasClicked", "S6");
    // // U
    // createPoint(new Point(2,2), "alertWasClicked", "U1");
    // createPoint(new Point(2,-2), "alertWasClicked", "U2");
    // createPoint(new Point(4,-2), "alertWasClicked", "U3");
    // createPoint(new Point(4,2), "alertWasClicked", "U4");
    
    // >>>> Lines <<<<

    // A
    // drawLine("A1", "A2");
    // drawLine("A2", "A3");
    // // S
    // drawLine("S1", "S1S2");
    // drawLine("S1S2", "S2");
    // drawLine("S2", "S3");
    // drawLine("S3", "S4");
    // drawLine("S4", "S5");
    // drawLine("S5", "S5S6");
    // drawLine("S5S6", "S6");
    // // U
    // drawLine("U1", "U2");
    // drawLine("U2", "U3");
    // drawLine("U3", "U4");
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
    pointExists: pointExists,
    isLocked: isLocked,
    lockObjects: lockObjects,
    unlockObjects: unlockObjects,
    setLockEnabled: setLockEnabled,
    addClickListener: addClickListener,
    
    appReady: appReady
  }
}());

/*************************************************************************************/

var geoApp;

//Adrin added this flag
var APPLET_READY = false;

var ready = function() {
  if(document.applets[0] != null && document.applets[0].isActive) {
    console.log("Applet ready...");
    geoApp = document.ggbApplet;
    APPLET_READY = true;



    //document.onclick = appletClicked;
  }  
  else {
    console.log("Applet not yet loaded...");
    setTimeout(ready, 10000);
  }
};

ready();
r1.appReady();
pF.appReady();

var appletClicked = function() {
  alertWasClicked(null)
}

/********************************************************************************/

/*var alertWasClicked = function(clickedObject)
{
  console.log(clickedObject + " was clicked");
  //parent.alertWasClicked(clickedObject);
  //controller.addAction(new Action("goTo", clickedObject));
}*/

/********************************************************************************/

// Adrin added this function, need to integrate it into the above code.
var __OBJECT_LISTENER_MAP__ = {};
function toggleAllObjectClickListeners(bool_activate) {
  console.dir("Calling toggleAllObjectClickListeners");
  console.dir("bool_activate : " + bool_activate);

  var no_of_objects = geoApp.getObjectNumber();
  for(var i = 0 ; i < no_of_objects ; i++) {
      var objectName = geoApp.getObjectName(i);
      
      console.log("objectName : " + objectName);
      
      if(geoApp.getObjectType(objectName).toLowerCase() == "point") {
        if(bool_activate) {
          geoApp.registerObjectClickListener(objectName, "alertWasClicked");
        }
        else {
          geoApp.unregisterObjectClickListener(objectName);
        }
      }
      else {
        console.log("Ignored " + objectName);
      }
  }
}