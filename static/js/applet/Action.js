/***********************************************************************
*
* Predefined robot actions methods
*
***********************************************************************/

/**********************************************************************/

var primitiveActions = {};  //primitiveActions namespace
primitiveActions.actions = {};
primitiveActions.procs = {};
primitiveActions.movingPoint = undefined; // point that is currently being moved
primitiveActions.movingPointBase = undefined;

/**********************************************************************/

//var controller, r1, pF;
primitiveActions.setVars = function()
{
  //if(frames[1])
  {
   // controller = frames[1].controller;
   // r1 = frames[1].r1;
   // pF = frames[1].pF;
    
    /***********************************************
    *
    * links to controller functions
    *
    ***********************************************/
    
    primitiveActions.actions.move = {
      label: "Move",
	ex: controller.moving.move
    };
    
    primitiveActions.actions.turn = {
      label: "Turn",
	ex: controller.moving.turn
    };
    
    primitiveActions.actions.plot = {
      label: "Plot Point2",
      ex: controller.drawing.plot
    };

    primitiveActions.actions.tempPlot = {
      label: "Plot Temporary Point",
      ex: controller.drawing.tempPlot
    };

    primitiveActions.actions.line = {
      label: "Draw line",
      ex: controller.drawing.line
    };

    primitiveActions.actions.tempLine = {
      label: "Draw a temporary line",
      ex: controller.drawing.tempLine
    };

    primitiveActions.actions.tempArc = {
      label: "Draw a temporary arc",
      ex: controller.drawing.tempArc
    };

    primitiveActions.actions.deleteLine = {
      label: "Delete Line",
      ex: controller.drawing.deleteLine
    };

    primitiveActions.actions.deleteArc = {
      label: "Delete Arc",
      ex: controller.drawing.deleteArc
    };

    primitiveActions.actions.deletePoint = {
      label: "Delete Point",
      ex: controller.drawing.deletePoint
    };

    primitiveActions.actions.moveSinglePoint = {
      label: "Move Single Point",
      ex: controller.moving.moveSinglePoint
    };

    primitiveActions.actions.turnSinglePoint = {
      label: "Turn Single Point",
      ex: controller.moving.turnSinglePoint
    };

  }
  //else
  //  setTimeout(setVars, 50)
};

/*********************************************************/

var alertWasClicked = function(clickedObject)
{
  clickListener.executeEvent(clickedObject);
}

var stopDragMode = function() {
  // Clearing everything
  primitiveActions.movingPoint = undefined;
  primitiveActions.movingPointBase = undefined;
  primitiveActions.fromDistance = undefined;
}



/********************************************************************
*
* Procedures
*
********************************************************************/


/**************************
* function moveDistance:
*
*/
primitiveActions.actions.moveDistance = {
    label: "Move",
    ex: function(params) {

      var dist = params.distance;

      if(primitiveActions.movingPointBase){
        var point = controller.getPoint(primitiveActions.movingPointBase);
      } else {
        var point = r1.location;
      }

      var newX = Math.round((point.x + xDist(dist, r1.orientation))*100000)/100000;
      var newY = Math.round((point.y + yDist(dist, r1.orientation))*100000)/100000;

      // Moving real robot
      realRobot.moveTo(newX, newY, dist < 0 ? true : false, r1.orientation);

      if(Math.abs(newX) <= 5 && Math.abs(newY) <= 5){
      	console.log("move " + dist);
      	controller.addAction(new Action("move", dist));

        // Handling point move state
        if(primitiveActions.movingPoint !== undefined){
          var newPoint = new Point(newX, newY);
          controller.addAction(new Action('tempPlot', newPoint));
          var currPoint = "P" + pF.currPointNum;
          // Add new temp line to robot
          controller.addAction(new Action('tempLine', [currPoint, primitiveActions.movingPointBase]));
          // Detach previous line
          controller.addAction(new Action('deleteLine', primitiveActions.movingPoint[primitiveActions.movingPoint.length-1].point + primitiveActions.movingPointBase));
          // Attach previous point to current one
          controller.addAction(new Action('tempLine', [primitiveActions.movingPoint[primitiveActions.movingPoint.length-1].point, currPoint]));
          // Set current point
          primitiveActions.movingPoint.push({
            point: currPoint, 
            orientation: invertAngle(r1.orientation, dist),
            type: "move"
          });
        }
      } else {
        console.log("Can't move. Has to stay inside of bounds...");
      }

    }
}

/**************************
* function turnAngle:
*
*/
primitiveActions.actions.turnAngle = {
    label: "Turn",
    ex: function(params) {

      // turn real robot
      realRobot.turnTo(parseInt((parseInt(params.angle) + r1.orientation) % 360));

      if(primitiveActions.movingPoint && primitiveActions.fromDistance){
        var prevPoint = primitiveActions.movingPoint[primitiveActions.movingPoint.length-1].point;
        // // Creating new temp plot
        
        // // Create line between the previous and current temp points
        // controller.addAction(new Action('tempLine', [prevPoint, currPoint]));
        // Deleting line between previous point and movingPointBase
        controller.addAction(new Action('deleteLine', prevPoint + primitiveActions.movingPointBase));

        // Creating arc
        if(params.angle > 0) {
          var arcParams = ["R", prevPoint, primitiveActions.movingPointBase];
          var i = 2; // i specifies which point will be replaced by the new temp point when the turn is finished
        } else {
          var arcParams = ["R", primitiveActions.movingPointBase, prevPoint];
          var i = 1; // i specifies which point will be replaced by the new temp point when the turn is finished
        }
        controller.addAction(new Action('tempArc', arcParams));
        // Turning
        controller.addAction(new Action('turn', params.angle));

        // Creating new temp point
        // I have to calculate where this point needs to be beforehand
        r = controller.getPoint("R");
        p = controller.getPoint(primitiveActions.movingPointBase);
        ex = r1.getExtension(primitiveActions.movingPointBase);
        dist = r.distanceTo(p);
        orient = r1.orientation+ex.angleDelta+parseInt(params.angle);
        orient = orient == 360 ? 0 : orient;
        pointX = (r.x + xDist(dist, orient)).toFixed(15);
        pointY = (r.y + yDist(dist, orient)).toFixed(15);

        controller.addAction(new Action('tempPlot', new Point(r1.location.x, r1.location.y)));
        var pivot = "P" + pF.currPointNum;
        controller.addAction(new Action('tempPlot', new Point(pointX, pointY)));
        var newPoint = "P" + (pF.currPointNum+1);


        // Creating new arc between robot, movingPointBase and new point
        var arcName = arcParams.join('');
        var newArcParams = arcParams.slice(0); // Cloning previous array due to concurrency issues
        newArcParams[0] = pivot;
        newArcParams[i] = newPoint; // Uses i as defined a couple of lines above
        controller.addAction(new Action('deleteArc', arcName));
        controller.addAction(new Action('tempArc', newArcParams));

        // Adding line between robot and new point
        controller.addAction(new Action('tempLine', [newPoint, primitiveActions.movingPointBase]));
        // Adding new point to list
        primitiveActions.movingPoint.push({
          point: newPoint, 
          orientation: orient,
          pivot: new Point(r1.location.x, r1.location.y),
          type: "turn",
          angle: parseFloat(params.angle)
        });

      } else {
        // Turning while NOT dragging a point
        controller.addAction(new Action('turn', params.angle));   
      }
    }
}


/********************************************************************
* function turnCardinal:
*
* parameters: the cardinal point to turn to
*
*********************************************************************/

primitiveActions.actions.turnCardinal = {
  label: "Turn to Cardinal",
  ex: function(direction) {
    this.cardinalPoints = {
      E: 0,
      W: 180,
      N: 90,
      S: 270
    }
    
    // turn real robot    
    realRobot.turnTo(this.cardinalPoints[direction.direction]);

    var angle = this.cardinalPoints[direction.direction] - r1.orientation;
    controller.addAction(new Action("turn", angle));
  }
}

/********************************************************************
* function movePoint: (different than move*To* Point)
*
* parameters: point that will be moved
*
*********************************************************************/
primitiveActions.actions.movePoint = {
  label: "Move Point",
  ex: function(point) {
    primitiveActions.movingPointBase = "R";
    controller.addAction(new Action("moveTo", {pointName : point.pointName}));
    controller.addAction(new Action("tempLine", [point.pointName, primitiveActions.movingPointBase]));
    primitiveActions.movingPoint = [{point:point.pointName, orientation: r1.orientation}];
  }
}


primitiveActions.actions.movePointDistance = {
  label: "Move Point from Distance",
  ex: function(point){
    pF.unlockObjects();
    // Adding robot's extension
    r1.addExtension(point.pointName);
    // Adding structure for shadow points and lines
    var target = controller.getPoint(point.pointName);
    controller.addAction(new Action('tempPlot', new Point(target.x, target.y)));
    var currPoint = "P" + pF.currPointNum;
    controller.addAction(new Action('tempLine', [currPoint, point.pointName]));

    primitiveActions.fromDistance = true;
    primitiveActions.movingPointBase = point.pointName;
    primitiveActions.movingPoint = [{point: currPoint, orientation: r1.orientation}];
    
    pF.lockObjects();
  }
}

primitiveActions.actions.stopMovingPoint = {
  label: "Stop Moving Point",
  ex: function() {
    // Move point through points list
    var actions = [];
    var pointName = primitiveActions.movingPoint[0].point;
    // Iterate through intermediate points in path
    while(primitiveActions.movingPoint.length > 1){
      var type = primitiveActions.movingPoint[1].type;
      var pivot = primitiveActions.movingPoint[1].pivot;
      var pivotName = type === "turn" ? pF.pointExists(pivot) : undefined;
      var origin = controller.getPoint(primitiveActions.movingPoint[0].point);
      var target = controller.getPoint(primitiveActions.movingPoint[1].point);
      var actionName = type === "turn" ? "turnSinglePoint" : "moveSinglePoint";  

      // Create line P-1
      if(type !== "turn"){
        actions.push(new Action("tempLine", [pointName, primitiveActions.movingPoint[1].point]));
      } else {
        var params;
        if(primitiveActions.movingPoint[1].angle > 0){
          params = [pivotName, pointName, primitiveActions.movingPoint[1].point];
        } else {
          params = [pivotName, primitiveActions.movingPoint[1].point, pointName];
        }
        actions.push(new Action("tempArc", params));
      }

      // Delete point 0
      if(pointName !== primitiveActions.movingPoint[0].point){ // Don't delete at the first time
        actions.push(new Action("deletePoint", primitiveActions.movingPoint[0].point));
      }

      // Perform animated actions
      actions.push(new Action(actionName, {
        point: pointName,
        orientation: primitiveActions.movingPoint[1].orientation,
        distance: type === "turn" ? pivot.distanceTo(target) : origin.distanceTo(target),
        pivot: pivot, // will be defined if primitiveActions.movingPoint[1].type is turn
        angle: primitiveActions.movingPoint[1].angle, // Angle that needs to be turned
        arc: params !== undefined ? params.join('') : undefined
      }));
      
      // Delete the line
      actions.push(new Action("deleteLine", [pointName, primitiveActions.movingPoint[1].point]));
      // If action was a turn, delete the pivot point
      if(type === "turn"){
        actions.push(new Action("deletePoint", pivotName));
      }
      //Removing first point from array
      primitiveActions.movingPoint.splice(0, 1);      
    }
    if(pointName !== primitiveActions.movingPoint[0].point){
      // Remove last point if it's not the point base (meaning that no actions were taken)
      actions.push(new Action("deletePoint", primitiveActions.movingPoint[0].point));
    } else {
      // must remove the line between robot and point
      actions.push(new Action("deleteLine", pointName + "R"));
    }
    // Remove moving point if it's not the robot
    if(primitiveActions.movingPointBase !== "R"){
      actions.push(new Action("deletePoint", pointName));
    }
    // Play actions
    primitiveActions.executeAction(actions);
    // Remove extensions (valid if this is closing a movePointDistance action)
    r1.removeExtension(primitiveActions.movingPointBase);
    // Stopping grab mode
    stopDragMode();
  }

}

/********************************************************************
* function plotPoint:
*
* parameters: none, the robot will plot a point at it's current location
*
********************************************************************/

primitiveActions.actions.plotPoint = {
  label: "Plot Point",
  ex: function() {
    //if(!r1.location.equals(newPoint))
    //  controller.addAction(new Action("goTo", newPoint));

    var newPoint = new Point(r1.location.x, r1.location.y);
      realRobot.plotPoint();
      var toggleBack = false;
      if(realRobot.isRobotEnabled()){
        realRobot.toggleRobot();  
        toggleBack = true;
      }
      controller.addAction(new Action("plot", newPoint));
      controller.addAction(new Action("move", 1.5));
      // controller.addAction(new Action("turnTo", {pointName : newPoint}));
      controller.addAction(new Action("moveTo", {pointName : newPoint}));
      controller.addAction(new Action("turn", -180, function(){
        if(toggleBack){
          realRobot.toggleRobot();  
        }
      }));
  }
};

/*****************************************************************
* function moveTo:
*
* parameters: the name of the point to go to or the point itself
*
*****************************************************************/

primitiveActions.actions.moveTo = {
  label: "Move To",
  ex: function(params) { //(pointName, pen, markUnits)
    var targetPoint = controller.getPoint(params.pointName);
    
    // Calculating angle
    var xDist = targetPoint.x - r1.location.x;
    var yDist = targetPoint.y - r1.location.y;
    var angleInRadians = Math.atan2(yDist, xDist);
    var angleInDegrees = parseInt(rtd(angleInRadians));
    // Moving real robot
    realRobot.moveTo(targetPoint.x, targetPoint.y, false, parseInt(angleInDegrees));


    //determine distance
    var dist = r1.location.distanceTo(targetPoint);
    
    console.log("r1.location = " + r1.location.x + "," + r1.location.y + " dist = " + dist);
      controller.addAction(new Action("turnTo", {pointName : targetPoint}));
      controller.addAction(new Action("move", dist));
  }
};

/************************************************************
* function turnTo:
*
* parameters: the name of point to turn to or the point itself
*
************************************************************/

primitiveActions.actions.turnTo = {
  label: "Turn To",
  ex: function(params) { //(pointName, speed)
    var targetPoint = controller.getPoint(params.pointName);
     
    console.log("turnTo Robot Location = " + r1.location.x + " - " + r1.location.y);

    var xDist = targetPoint.x - r1.location.x;
    var yDist = targetPoint.y - r1.location.y;
    var angleInRadians = Math.atan2(yDist, xDist);
    var angleInDegrees = rtd(angleInRadians);

    realRobot.turnTo(parseInt(angleInDegrees));
    
    console.log("angInDeg = " + angleInDegrees + " and orient = " + r1.orientation); 

      controller.addAction(new Action("turn", angleInDegrees - r1.orientation));
  }
};



/*****************************************************************
* function drawLine:
*
* parameters: the name of the point to go to or the point itself
* Note, could be collapsed with moveTo, with Two Parameters
*
*****************************************************************/

primitiveActions.actions.drawLineTo = {
  label: "Draw Line To",
    ex: function(params) { //(pointName, pen, markUnits)
	var targetPoint = controller.getPoint(params.pointName2);
	var currentPoint = controller.getPoint(params.pointName);
        //determine distance
        var dist1 = r1.location.distanceTo(currentPoint);
	var dist2 = currentPoint.distanceTo(targetPoint);
  var speed = r1.speed("move");

	console.log("params: " + params.pointName2 + " - " + params.pointName);

        controller.addAction(new Action("turnTo", {pointName : currentPoint}));
        controller.addAction(new Action("move", dist1));
        controller.addAction(new Action("turnTo", {pointName : targetPoint}));
        controller.addAction(new Action("line", [params.pointName, "R"]));
        controller.addAction(new Action("move", dist2));
        controller.addAction(new Action("deleteLine", params.pointName + "R"));
        controller.addAction(new Action("line", [params.pointName, params.pointName2]));

        // console.dir(dist2);
        // var wholeDist = parseInt(dist2/speed,10);
        // var partDist = dist2 - wholeDist*speed;
        // var moved = 0;

        // for(var i = 0; i < wholeDist; i++){
        //   controller.addAction(new Action("move", speed));
          

        // }

        // controller.addAction(new Action("move", partDist));
        // controller.addAction(new Action("line", [params.pointName, params.pointName2]));
    
  }
};

/**********************************************************************
* function measureDistance:
*
* parameters: one or two points or point names in an array
*
* wanna change to allow more flexibility
*
**********************************************************************/

primitiveActions.actions.measureDistance = {
  label: "Measure Distance",
  ex: function(point) { //(targetPoint, pen, markUnits)
    var targetPoint, originPoint;
    var dist = 0;
  
    console.log("Measuring distance...");
  
    //if two parameters are passed then two points have been specified;
    // move to the first point before "measuring" the distance
    if(point instanceof Array)
    {
      console.log("Found two points...");
      targetPoint = controller.getPoint(point[1]);
      console.log("Target: " + targetPoint.x + "," + targetPoint.y);
      originPoint = controller.getPoint(point[0]);
      console.log("Origin: " + targetPoint.x + "," + targetPoint.y);
      controller.addAction(new Action("goTo", originPoint));
    }
    else
    {
      console.log("Found one point...");
      targetPoint = controller.getPoint(point);
      originPoint = r1.location;
    }
  
    //calculate distance
    dist = originPoint.distanceTo(targetPoint);
    console.log("Distance measured = " + dist);

    controller.addAction(new Action("goTo", targetPoint));

    //not sure what to do with this exactly

    //add distance label  
//    var first = "P" + (controller.getLastPointNum()-1);
//    var second = "P" + (controller.getCurrPointNum()-1);
    
    return dist; //not sure how handling this yet
  }
};

/*********************************************************************
*
* function addDistanceLabel
* Adds a label to a line segment representing the length of the segment.
* TODOS: should be both negative and positive
*
*********************************************************************/

primitiveActions.actions.addDistanceLabel = {
  label: "Add Distance Label",
  ex: function(origin, target) {
      var segmentName = origin + target;
      geoApp.setLabelStyle(segmentName, 2);
      geoApp.setLabelVisible(segmentName, true);
  }
};

/********************************************************************
*
* function computeValue
*
*********************************************************************/

primitiveActions.actions.computeValue = {
  label: "Compute Value",
  ex: function(params) {
      var expressionStr = params.formula;
      var answer = eval(expressionStr);
      console.log("computeValue - " + answer);
      return answer;
  }
};

/**********************************************************************
*
* Functions for creating new procedures, and manipulating the existing
* procedures.
*
***********************************************************************/

primitiveActions.getActions = function()
{
  var list = {}, prop;
  var acts = primitiveActions.actions;

  //some of the specifics of this might need to change at some point
  
  for (prop in acts)
    list[acts[prop].label] = prop;
  
  return list;
};

//action can either be a single action stored in primitiveActions.actions
// or an array of steps

primitiveActions.executeAction = function(action)
{
  var act, i;
  
    console.log("Executing... " + action.name + " " + JSON.stringify(action.op));
   
  if(action.constructor.getName() == "Action")
  {

    act = primitiveActions.actions[action.name];
    // if(action.callback){
    //   action.callback();
    // }

    if(!(act.ex instanceof Array))
      {
    console.log("primitiveActions.executeAction in If");

	  act.ex(action.op);
      }
    else
    {
    console.log("primitiveActions.executeAction in else");

      for(i = 0; i < act.ex.length; i++)
        controller.addAction(act.ex[i]);
    }
  }
  else
  {
    for(i = 0; i < action.length; i++)
      controller.addAction(action[i])
  }
};

primitiveActions.addNewAction = function(label, steps)
{
  if(!primitiveActions.actions[label])
  {
    console.log(label);
    console.log(steps);
    primitiveActions.actions[label] = {
      label: label,
      ex: steps
    }
  
    //sets the value to the label, fine for now but may need to change
    primitiveActions.procs[label] = label;
  }
  else
  {
    alert("Attempting to add action with the same label as one that exists!");
  }
};

primitiveActions.getProcs = function()
{
  return primitiveActions.procs;
};

primitiveActions.getSteps = function(name)
{
  console.log("Getting steps... " + name);
  if(primitiveActions.actions[name].ex instanceof Array)
    return primitiveActions.actions[name].ex;
  else
    return null;
};

function postSolutionCheck(solutionStatus) {
  var msg = {"type" : "check", "status" : solutionStatus};
  //ajax(ADR.POST_SOLUTION_CHECK + "?index=" + 0 + "&data=" + String(solutionStatus), [], "");
  ajax(ADR.POST_SOLUTION_CHECK + "?index=" + 0 + "&data=" + escape(JSON.stringify(msg)), [], "");
  ajax(ADR.MAKE_ATTRIBUTION + "?desattr=" + "desirable" + "&out=" + (solutionStatus === true ? "success" : "failure"))
}

controller.initialize();
