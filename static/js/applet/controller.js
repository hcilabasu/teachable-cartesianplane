var controller = (function() {
  console.log("Controller...");

function send(){ return r1.location.x;}

  /*******************************************************************************/

  //var primitiveActions;

  /*******************************************************************************/

  var animating = false;

  /* 
    This variable is used when the pausing functionality is on.
    It's used to prevent the robot from uttering it's initial position.
  */
  var firstStep = true;

  var animate = function(act) {
    var stepSize, temp, action;
    
    var total = 0;

    //used for both  moving and turning
    var getDistance = function(act) {
      if(act.name === "moveSinglePoint") {
        return act.op.distance;
      }
      else if(act.name === "turnSinglePoint") {
        return act.op.angle;
      }
      else {
        return act.op;
      }
    }

    var getAction = function(act, dist, finalStep) {
      if(act.name === "moveSinglePoint") {
        return new Action(act.name, {
          point: act.op.point,
          orientation: act.op.orientation,
          distance: dist
        });
      }
      else if(act.name === "turnSinglePoint") {
        return new Action(act.name, {
          point: act.op.point,
          pivot: act.op.pivot,
          angle: dist,
          distance: act.op.distance,
          arc: act.op.arc,
          isFinalStep: finalStep
        });
      }
      else {
        return new Action(act.name, dist);
      }
    }

    stepSize = r1.speed(act.name); // function defined in appObject.js
    
    if(getDistance(act) < 0) {//only for turn or for move too?
      stepSize = -stepSize;
    }
      
    temp = getDistance(act);
    while(temp != 0) {
      if(Math.abs(temp) <= Math.abs(stepSize)) {
        action = getAction(act, temp, true); //temp is the distance measure
        total += temp;
        temp = 0;
        action.callback = act.callback;
      }
      else {
        action = getAction(act, stepSize, false); //stepSize is the distance measure
        total += stepSize;        
        temp -= stepSize;
      } 
      
      console.log("Adding action: " + action.name + " " + action.op);        
      actionsTree.addAction(action);
    }
    
    console.log("Animated... " + act.name + " " + total);
      
    animating = true;  
    actionsTree.executeAction();  
  }
  
  /*******************************************************************************/
  
  var getPoint = function(point) {
    return pF.getPoint(point);
  }

  /*******************************************************************************/
  
  var actionsTree = (function() {
    var rootNode, isPlotPointAction = false;
    var currentRobotCoords = new Point(0, 0); //Just initializing, gets updated in doneAction. Need it for the plot point action.
    var prevPlottedPointCoords = new Point(0, 0); //Just initializing, gets updated in doneAction. Need it for the moveTo operation on the plotPoint action.
    var currNode = (rootNode = new Node());//getting a handle on the root node
    var tempActionListWhileAnimating = []; //This array is cleared out in check

    function Node(action, parent) {
      if(!action && !parent) {
        console.log("actionsTree created the root node....");
      }

      var node = {
        value: action,
        children: [],
        parent: parent,
            
        firstChild: function() {
          console.log("firstChild");
          return this.children[0];
        },
        addChild: function(action) {
          console.log("addChild");
          
          //Adrin made some changes here
          // this.children.push(new Node(action, this)); //original
          
          //Added the APPLET_READY flag, since without it, a fresh launch of the applet was causing it to hang.
          //!!!Need to find a way to disallowing actions to be added during plot point, but to allow plot point sub actions
          if(APPLET_READY && !animating /*&& !isPlotPointAction*/) {
            console.log("APPLET_READY : " + APPLET_READY + ", animating : " + animating + ". Pushing into main actionsTree.");
            this.children.push(new Node(action, this));
          }
          else {
            console.log("Adding to tempActionListWhileAnimating.....");
            // console.log("isPlotPointAction " + isPlotPointAction);
            
            //!!!Adrin try adding the actions in rootNode directly over here. Can reduce some unnecessary dependencies, variables and functions.

            tempActionListWhileAnimating.push(action);
            console.log("tempActionListWhileAnimating : " + JSON.stringify(tempActionListWhileAnimating));
          }
        }
      };
      
      return node;
    }
    
    return {
      executeAction: function() {
        console.log("actionsTree.executeAction");

        // allow objects to be moved
        if(pF.isLocked()) {
          pF.unlockObjects();
        }
        


        if(animating) {
          console.log("In execute action animating.");
          var delay = 2500;
          var act = currNode.children.shift().value;
          var orientation = r1.orientation;
          // get the location depending on the way the robot is moving
          var getLocation = function(){
            var robotLocation;
            if(orientation === 90 || orientation === 270) // Robot is moving top/bottom
                robotLocation = r1.location.y;
              else // Robot is moving left/right
                robotLocation = r1.location.x;
            return robotLocation;
          };

          if(act.name === "move"){
            if(firstStep === true){
              firstStep = false;
            } else {
              if(PAUSEENABLED){
                var location = getLocation();
                
                if(location % 1 == 0){
                    // Play whole number sound
                  ajaxSync(ADR.SAY_NUMBER + "?state=animating&number=" + Math.round(location-0.001), undefined, undefined, function(){
                    sleep(delay);  
                  });
                }
              }  
            }
          }
          

          console.log("currNode children length " + currNode.children.length);
          if(firstStep === false && currNode.children.length === 0 && act.name === "move"){
            // This is the last step in the animation. Set firstStep variable back to true, 
            // and have Quinn say the verbose current position message.
            firstStep = true;
            var speed = getLocation() > 0 ? r1.speed(act.name) : r1.speed(act.name) * -1;
            var location = getLocation() + speed;
            ajaxSync(ADR.SAY_NUMBER + "?state=completed&number=" + Math.round(location-0.001) + 
                                      "&coordinate=" + JSON.stringify({x:Math.round(r1.location.x), y:Math.round(r1.location.y)}));
          }
          
          primitiveActions.executeAction(act); //controller.moving[act.name](act.op);  
        }
        else if(moving[currNode.firstChild().value.name]) {// "move" || "turn" || "moveSinglePoint"
          
          console.log("In execute action moving.");
          currNode = currNode.firstChild();
          //if(Math.abs(currNode.value.op) > 0) //why did I put this here? // Don't ask me!
          animate(currNode.value);
        }
        else {
          alert("B");
          console.log("In execute action else.");
          currNode = currNode.firstChild();

          //Adrin added the line below
          //Very important step, need to do this since the plot point action is dependant on the summation of the previos actions, 
          //and the current location of the robot.
          //!!!Need to be careful if the "plot" action name is changed elsewhere!!!
          
          console.log("ACTION NAME : " + currNode.value.name);

          var currentActionName = currNode.value.name;
          if(currentActionName == "plot") {
            console.log("isPlotPointAction = true");
            isPlotPointAction = true;
            currNode.value.op = currentRobotCoords;

            //Need this for the subsequent moveTo operation that is part of the plotPoint action.
            prevPlottedPointCoords.x = currentRobotCoords.x;
            prevPlottedPointCoords.y = currentRobotCoords.y;
          }
          else if((currentActionName == "moveTo" || currentActionName == "turnTo") && isPlotPointAction) {
            //!!!Need to reset the moveTo coordinates.
            //!!!Need to make sure this structure inside this particular action does not change, or change should also be reflected here.
            //current structure {"name":"moveTo","op":{"pointName":{"x":3.75,"y":0}}}
            console.log("prevPlottedPointCoords : " + JSON.stringify(prevPlottedPointCoords));
            currNode.value.op = {"pointName" : prevPlottedPointCoords};
          }
          else if(currentActionName == "finishedPlot") {
            isPlotPointAction = false;
          }

          primitiveActions.executeAction(currNode.value);
        }
        
        this.doneAction();
      },
      doneAction: function() {
        currentRobotCoords.x = r1.location.x;
        currentRobotCoords.y = r1.location.y;
        console.log("currentRobotCoords : " + JSON.stringify(currentRobotCoords));

        if(currNode.children.length == 0 && currNode.parent) {
          console.log("In doneAction, children = 0");
          
          if(animating) {
            console.log("In doneAction, animating == true");
            animating = false;
            drawing.adjustLoc();
          }
        
          if(currNode.value.callback) {
            console.log("currNode has a callback.");
            currNode.value.callback();
          }
          
          console.log("currNode is pointing back to parent");

          currNode = currNode.parent;
          currNode.children.shift();
          this.doneAction();
          // console.log("Finished action...");
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

        if(actionIsValid) {
          currNode.addChild(newAction); //.children.push(new Node(action, currNode));
        }
        else {
          // TODO send message to interface
        }
      },
      empty: function() {
        return currNode.children.length;
      },
      getRootNode: function() {return rootNode;},
      getTempActionListWhileAnimating: function() {return tempActionListWhileAnimating;},
      clearTempActionListWhileAnimating: function() {tempActionListWhileAnimating = [];},
      resetRobotCoordinates: function() {
        currentRobotCoords.x = r1.location.x;
        currentRobotCoords.y = r1.location.y;
        return currentRobotCoords;
      }
    };
  }());

  /******************************************************************************/

  var initialize = function() {
    //primitiveActions = pA;
    for (i in primitiveActions) {
      if (primitiveActions.hasOwnProperty(i)) {
        console.log(i);
      }
    }

    primitiveActions.setVars();
    check();
  };

  var check = function() {
    //console.log("check");
    // console.log("actionsTree length " + actionsTree.empty());
    
    //if actionsTree is not empty, execute actions in it
    if(actionsTree.empty()) {
      actionsTree.executeAction();
    }
    else if(actionsTree.getRootNode().children.length == 0 && actionsTree.getTempActionListWhileAnimating().length > 0) {//Adrin added this; checking for actions added while animating, and if actionsTree is empty
      var tempActionListWhileAnimating = actionsTree.getTempActionListWhileAnimating();
      console.log("In check(), tempActionListWhileAnimating.length > 0");
      
      // for(var i = 0 ; i < tempActionListWhileAnimating.length ; i++) {
      while(tempActionListWhileAnimating.length != 0) {
        console.log("Dumping actions from tempActionListWhileAnimating.....");
        var tempAction = tempActionListWhileAnimating.shift();
        console.log("tempAction : " + JSON.stringify(tempAction));
        actionsTree.addAction(tempAction);
      }

      // actionsTree.clearTempActionListWhileAnimating();

      actionsTree.executeAction();
    }
    else {
      // console.log("check last else");
      //Adrin added this, need to make sure this is only called after the actionsTree is empty and no more actions are to be performed
      //The robot current coordinates stored in the actionsTree object needs to be reset when the problem is refreshed from the mobile side.
      //This takes care of that.
      actionsTree.resetRobotCoordinates();

      if(!pF.isLocked()) {
        pF.lockObjects();
      }
    }

    setTimeout("controller.check()", 50);
  };
  
  /******************************************************************************/
      
  var drawing = {
    plot: function(newPoint) {
      pF.createPoint(newPoint);//, "alertWasClicked"); // Add function if points need to respond to clicking
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
      if(PAUSEENABLED)
      {
        r1.makeCrosshair();
      }


      geoApp.evalCommand("RB = Circle[R, C1]");

     // console.log("Location after adjustment... " + r1.location.x + ", " + r1.location.y);
    },
    line: function(pointList) {
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
    deleteLine: function(lineName) {
      console.log("Deleting line " + lineName);
      pF.deleteObject(lineName);
    },
    deletePoint: function(pointName) {
      console.log("Deleting point " + pointName);
      pF.deleteObject(pointName);
    }
  };
  
  var moving = {    
    turn: function(deg) {
    var radians = dtr(deg);
    
    r1.orientation = (parseFloat(r1.orientation) + parseFloat(deg)) % 360;
    // console.log("Orientation = " + r1.orientation);
    if(r1.orientation < 0) {
      r1.orientation += 360;
    }
              
      geoApp.evalCommand("E = Rotate[E, " + radians + ", R]");
      r1.makeExtensions();
    },
    move: function(dist) {
      r1.location.x = Math.round((r1.location.x + xDist(dist, r1.orientation))*100000)/100000;
      r1.location.y = Math.round((r1.location.y + yDist(dist, r1.orientation))*100000)/100000;
      // console.log("Location = " + r1.location.x + "," + r1.location.y);
      r1.makeCenter();
      r1.makeEyes();
      r1.makeExtensions();
      if(PAUSEENABLED)
      {
        r1.makeCrosshair();
      }
    },
    moveSinglePoint: function(move) {
      var point = move.point,
      orientation = move.orientation,
      distance = move.distance,
      oldX = geoApp.getXcoord(point),
      oldY = geoApp.getYcoord(point),
      newX = Math.round((oldX + xDist(distance, orientation))*100000)/100000,
      newY = Math.round((oldY + yDist(distance, orientation))*100000)/100000;
      geoApp.setCoords(point, newX, newY);
    },
    turnSinglePoint: function(turn) {
      var point = turn.point,
      distance = turn.distance,
      pivot = turn.pivot,
      turnAngle = parseFloat(turn.angle),
      orientation = angle(pivot, pF.getPoint(point)),
      newOrientation = (orientation + turnAngle) % 360,
      arc = turn.arc;

      var newX = pivot.x + xDist(distance, newOrientation);
      var newY = pivot.y + yDist(distance, newOrientation);

      if(turn.isFinalStep) {
        geoApp.setVisible(arc, false);
      }

      geoApp.setCoords(point, newX, newY);
    }
  };

  var deleteObject = function(object) {
    pF.deleteObject(object);
  }


  //CHECKING THE SLEEP FUNCTION
  function sleep(milliseconds) {
    var start = new Date().getTime();
    while(true){
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

  /******************************************************************************/

  return {
    //return "public" method call

    addAction: actionsTree.addAction,
    moving: moving,
    drawing: drawing,
    check: check,
    initialize: initialize,
    getPoint: getPoint,
    deleteObject: deleteObject
  }
}());
