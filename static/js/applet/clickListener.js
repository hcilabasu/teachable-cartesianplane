var clickListener = (function() {
//  console.log("Click listener...");

  var stateMachine = (function() {
  
//  console.log("State machine...");
  
    /*******************************************************************
    *
    * states:
    *
    * 0: idle
    * 1: the robot has been clicked
    * 2: a point has been clicked
    * 3: two points have been clicked
    *
    * events:
    *
    * 0: clicked robot
    * 1: clicked point
    * 2: clicked field
    * 3: clicked axis
    * 4: selected an option
    *
NB ERIN: leaving in the state machine, but very much simplifying.

    ********************************************************************/
  
    var states = [];
    var currentState;
    
    var maxArgs = 2;
    var args = [];
  
    //hard coded for now, could be configurable
    var loadStates = (function() {
      
      //idle
      states[0] = {
        options: null,
        events: [1,2,0,0,0]
      },
    
      //robotClicked
      states[1] = {
        options: [
          { act:"move", index:0 },
          { act:"turn", index:0 },
          { act:"plotPoint" }        
        ],
        events: [1,2,0,0,0]
      },
    
      //onePoint
      states[2] = {
        options: [
          { act:"goTo", index:0 },
          { act:"measureDistance", index:0 }
        ],
        events: [1,3,0,0,0]
      },
    
      //twoPoints
      states[3] = {
        options: [
          { act:"measureDistance", index: [0,1] },
          { act:"goTo", index:1 }
        ], //drawing lines to be implemented later
        events: [1,3,0,0,0]
      },
      
      currentState = states[0];
    }());
  
    var transition = function(eIndex) {
      currentState = states[currentState.events[eIndex]];
    };
    
    var getOptions = function() { 
      return currentState.options;
    };
    
    var clearArgs = function() {
      // log("Clearing args: " + args);
      args = [];
    }
    
    var addArg = function(newArg) {
      // log("Adding new arg to " + args);
      
      if(args.length == maxArgs) {
        args.shift();
      }

      args.push(newArg);
      
      // log("Args is now: " + args);
    };
    
    var getArg = function(i) {
      return args[i];
    };
    
    return {
      transition: transition,
      getOptions: getOptions,
      clearArgs: clearArgs,
      addArg: addArg,
      getArg: getArg
    }
  }());
  
  var getOptions = function(optionsList) {
    var options = [];
    var op = null, o;
    
    // log("Getting options...");
    
    if(optionsList) {
      for(var i = 0; i < optionsList.length; i++) {
        o = optionsList[i];
      
        //I think there's probably a built in array method to do this kind of
        // processing
        if(o.index instanceof Array) {
          op = [];
          for(var j = 0; j < o.index.length; j++) {
            op[j] = stateMachine.getArg(o.index[j]);
          }
        }
        else {
          op = stateMachine.getArg(o.index);
        }

        options[i] = new Action(o.act, op);
        op = null;
      }
    }
    
    return options;
  };
  
/** ExecuteEvent is critical to the current functioning of the system.
      It gets called on a clickListener event
*/
  var executeEvent = function(eventJSON) {
    event = eventJSON;
    var eIndex;
    var origin, pointName;

    if(event != null && event.constructor.getName() == "Action") {
      // log("event constructor is action. " + JSON.stringify(event));
      primitiveActions.executeAction(event);
    }
    else {
      if(event == null) {
          origin = "playingField";
          //	console.log("origin is playingField");
      }
      else if(event.constructor.getName() == "Action") {
        eIndex = 4; //an option was selected event
        origin = "action"; // the event is an action
      }
      else if(event.constructor.getName() == "Point") {
        eIndex = 2; //the field was clicked event
        origin = "field"; // I don't know what this means
      }
      else {
        if(event == "X1" || event == "X2" || event == "Y1" || event == "Y2") {
          eIndex = 3; //an axis was clicked event
          origin = "axis";
        }
        else if(event == "R" || event == "E" || event == "RB") {
          eIndex = 0; //the robot was clicked event
          origin = "robot";
          // log("Student clicked on the robot",{"source":"system"});
        }
        else {
          eIndex = 1; //a point was clicked event
          origin = "point"; // ERIN - need to know which point was clicked
          pointName = event;
        }
      }

      JSONoptions = {"trigger": origin};

      if(pointName != null) {
        JSONoptions = {"trigger": origin, "pointName": pointName};
      }

      $.ajax({url:"loadOptions", 
      	data: JSONoptions, 
      	//dataType: "json",
      	beforeSend: function(x) {
    	    if(x && x.overrideMimeType) {
      		  x.overrideMimeType("application/j-son;charset=UTF-8");
          }
      	},
      	success: function(data) {
          console.dir(data);
        }
      });
    }
    
    // older code

    
    //frames[2].actionOpts.loadOptions(getOptions(stateMachine.getOptions()));
    // do a remote procedure call
     /* options = getOptions(stateMachine.getOptions());
      JSONoptions = {"actions": JSON.stringify(options)};
      console.log("options: " + JSONoptions);
      $.ajax({url:"loadOptions", 
	      data: JSONoptions, 
	      //dataType: "json",
              beforeSend: function(x) {
		  if (x && x.overrideMimeType) {
		      x.overrideMimeType("application/j-son;charset=UTF-8");
		  }
              },
	      success: function(data) 
              {alert(data);}
           });*/
  };

  
  //defining functions for event processing
      
  /*var events = [
    function(val) {
      console.log("Executing clickedRobot event...");
      stateMachine.clearArgs();
    },
    function(val) { 
      console.log("Executing clickedPoint event...");
      stateMachine.addArg(val);
    },
    function(val) {
      console.log("Executing clickedField event...");
      primitiveActions.executeAction(new Action("goTo", val));
      stateMachine.clearArgs();
    },
    function(val) {
      console.log("Executing clickedAxis event...");
      primitiveActions.executeAction(new Action("turnToAxis", val));
      stateMachine.clearArgs();
    },
    function(val) {
      console.log("Executing selected event...");
      primitiveActions.executeAction(val);
      stateMachine.clearArgs();
    }
  ];*/
  
  return {
    executeEvent: executeEvent
  }
}());
