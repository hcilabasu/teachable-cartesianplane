var controller = (function() {
  console.log("Controller...");

  /*******************************************************************************/

  //var primitiveActions;

  /*******************************************************************************/

  var animating = false;
  var animate = function(act) {
    var stepSize, temp, action;
    
    var total = 0;

    var getDistance = function(act){
      if (act.name === "moveSinglePoint") {
        return act.op.distance;
      } else {
        return act.op;
      }
    }

    var getAction = function(act, dist){
      if (act.name === "moveSinglePoint") {
        return new Action(act.name, {
          point: act.op.point,
          orientation: act.op.orientation,
          distance: dist
        })
      } else {
        return new Action(act.name, dist);
      }
    }

    stepSize = r1.speed(act.name); // function defined in appObject.js
    if(getDistance(act) < 0) //only for turn or for move too?
      stepSize = -stepSize;
      
    temp = getDistance(act);
    while(temp != 0)
    {
      if(Math.abs(temp) < Math.abs(stepSize))
      {
        action = getAction(act, temp); //temp is the distance measure
        total += temp;
        temp = 0;
      }
      else
      {
        action = getAction(act, stepSize); //stepSize is the distance measure
        total += stepSize;        
        temp -= stepSize;
      } 
//      console.log("Adding action: " + action.name + " " + action.op);        
      actionsTree.addAction(action);

    }
    
//    console.log("Animated... " + act.name + " " + total);
      
    animating = true;      
    actionsTree.executeAction();  
  }
  
  /*******************************************************************************/
  
  var getPoint = function(point) {
    return pF.getPoint(point);
  }

  /*******************************************************************************/
  
  var actionsTree = (function() {
    var currNode = new Node();
    
    function Node(action, parent) {
      var node = {
        value: action,
        children: [],
        parent: parent,
            
        firstChild: function() { return this.children[0]; },
        addChild: function(action) { this.children.push(new Node(action, this)); }
      };
        
      return node;
    }
    
    return {    
      executeAction: function() {
        if(animating)
        {
	    console.log("In execute action animating.");
          var act = currNode.children.shift().value;
          primitiveActions.executeAction(act); //controller.moving[act.name](act.op);
        }
        else if(moving[currNode.firstChild().value.name]) // == "move" || currNode.firstChild().value.name == "turn")
        {
	         console.log("In execute action moving.");
          currNode = currNode.firstChild();
          //if(Math.abs(currNode.value.op) > 0) //why did I put this here? // Don't ask me!
            animate(currNode.value);
        }
        else
        {
	    console.log("In execute action else.");
          currNode = currNode.firstChild();
          primitiveActions.executeAction(currNode.value);
        }
      
        this.doneAction();
      },
    
      doneAction: function() {
        if(currNode.children.length == 0 && currNode.parent)
        {
          if(animating)
          {
            animating = false;
            drawing.adjustLoc();
          }
          
          currNode = currNode.parent;
          currNode.children.shift();
          this.doneAction();
        
//          console.log("Finished action...");
        }
      },

      addAction: function(newAction) {
        var actionIsValid = true;
        console.log("controller.addAction " + JSON.stringify(newAction));
        // Validating action
        // if(newAction.name === "move"){
        //   // Validating move
        //   var dist = newAction.op;
        //   var newX = Math.round((r1.location.x + xDist(dist, r1.orientation))*100000)/100000;
        //   var newY = Math.round((r1.location.y + yDist(dist, r1.orientation))*100000)/100000;
        //   if(Math.abs(newX) > 5 || Math.abs(newY) > 5){
        //     actionIsValid = false;
        //   }
        // }
        // Executing action based on validation outcome
        if(actionIsValid){
          currNode.addChild(newAction); //.children.push(new Node(action, currNode));
        } else {
          // TODO send message to interface
        }
      },
      
      empty: function() {
        return currNode.children.length;
      }
    }
  }());

  /******************************************************************************/

  var initialize = function() {
    //primitiveActions = pA;
      for (i in primitiveActions)
      {
	  if (primitiveActions.hasOwnProperty(i))
	      console.log(i);
      }
    primitiveActions.setVars();
    check();
  };

  var check = function() {
      console.log("check");
    if(actionsTree.empty())
      actionsTree.executeAction();
    setTimeout("controller.check()", 50);
  };
  
  /******************************************************************************/
      
  var drawing = {
    plot: function(newPoint) {
      pF.createPoint(newPoint, "alertWasClicked");
    },

    tempPlot: function(newPoint) {
      var point = pF.forceCreatePoint(newPoint, undefined);
      geoApp.evalCommand("SetPointSize[" + point + ",1]");
      geoApp.evalCommand("ShowLabel[" + point + ",false]");
    },
    
    adjustLoc: function() {
      r1.location.x = Math.round(r1.location.x * 100)/100;
      r1.location.y = Math.round(r1.location.y * 100)/100;
      r1.makeCenter();
      r1.makeEyes();
      r1.makeExtensions();
      geoApp.evalCommand("RB = Circle[R, C1]");
    

//      console.log("Location after adjustment... " + r1.location.x + ", " + r1.location.y);
    },
	line: function(pointList) 
	{
	    console.log("In line " + pointList[0] + ", " + pointList[1]);
	    pF.drawLine(pointList[0], pointList[1]);
	},
  tempLine: function(pointList){
      console.log("In temp line " + pointList[0] + ", " + pointList[1]);
      pF.drawLine(pointList[0], pointList[1]);
      geoApp.evalCommand("SetLineStyle[" + pointList[0] + pointList[1] + ", 1]");
  },
  tempArc: function(pointList){
      console.log("In temp arc " + pointList[0] + ", " + pointList[1] + ", " + pointList[2]);
      pF.drawArc(pointList[0], pointList[1], pointList[2]);
      geoApp.evalCommand("SetLineStyle[" + pointList[0] + pointList[1] + pointList[2] + ", 1]");
  },
  deleteArc: function(arcName){
    console.log("Deleting arc " + arcName);
    pF.deleteObject(arcName);
  },
  deleteLine: function(lineName)
  {
    console.log("Deleting line " + lineName);
    pF.deleteObject(lineName);
  },
  deletePoint: function(pointName)
  {
    console.log("Deleting point " + pointName);
    pF.deleteObject(pointName);
  }
  };
      
  var moving = {    
    turn: function(deg) {
      var radians = dtr(deg);
      
      r1.orientation = (parseFloat(r1.orientation) + parseFloat(deg)) % 360;
//      console.log("Orientation = " + r1.orientation);
      if (r1.orientation < 0)
        r1.orientation += 360;
              
      geoApp.evalCommand("E = Rotate[E, " + radians + ", R]");
      r1.makeExtensions();
    },
      
    move: function(dist) {
      r1.location.x = Math.round((r1.location.x + xDist(dist, r1.orientation))*100000)/100000;
      r1.location.y = Math.round((r1.location.y + yDist(dist, r1.orientation))*100000)/100000;
//      console.log("Location = " + r1.location.x + "," + r1.location.y);
      r1.makeCenter();
      r1.makeEyes();
      r1.makeExtensions();
    },

    moveSinglePoint: function(move){
      var point = move.point;
      var orientation = move.orientation;
      var distance = move.distance;

      var oldX = geoApp.getXcoord(point);
      var oldY = geoApp.getYcoord(point);

      var newX = Math.round((oldX + xDist(distance, orientation))*100000)/100000;
      var newY = Math.round((oldY + yDist(distance, orientation))*100000)/100000;
      geoApp.setCoords(point, newX, newY);

    }
  };

  var deleteObject = function(object){
    pF.deleteObject(object);
  }

  /******************************************************************************/

  return {
    //return "public" method calls

    addAction: actionsTree.addAction,
    moving: moving,
    drawing: drawing,
    check: check,
    initialize: initialize,
    getPoint: getPoint,
    deleteObject: deleteObject
  }
}());
