var __SOURCE__ = "system";

/*
 * Logging function. The parameter should be a string, which will be logged.
 * Events are logged to logs/log.txt in the mobile side
 * Adrin made changes to this function
 * title - main log message
 * data - an object containing source and other info if needed
 * bool_verbose - true => geogebra + robot status info is included in each log call
 */
function log(title, data, bool_verbose) {
    try {
        data = (!data) ? {} : data;
        var ggStatus = getGeogebraStatus();
        data.geo_status = ggStatus;
        data.initial = ggStatus.string;
        
        if(data && data.type && ["moveTo", "turnTo", "plot", "tempPlot", "tempLine", "tempArc", "grabPointFromDistance"].indexOf(data.type) == -1) {
            if(data && data.type && (data.type.indexOf("move") != -1 || data.type.indexOf("plotPoint") != -1 || data.type.indexOf("turn") != -1)) {
                data.final = calculateFinalState(ggStatus.state, data.type, data.parameter).string;
            }
            
            var dataPacket = {"type":"log","data":{"title": "CARTESIAN -> " + title,"data":data,"bool_verbose":bool_verbose}};

            console.log(title);

            // Logging in server
            $.ajax({
                url: ADR.LOG + "?data=" + JSON.stringify(dataPacket),
                success: function(data) {
                    console.dir("Event '" + title + "' LOGGED!");
                }
            });
        }
    }
    catch(e) {
        console.dir("log function failed!!! : " + e.toString());
    }
}

//Adrin added this function to calculate the final state of the cartesian plane for logging purposes
//!!! For grab points, going to assume there is only one point on the plane, and if grab is enabled, that point has been grabbed by robot.
function calculateFinalState(initialState, operation, parameter) {
    var finalState = {"string":"", "state":{}};

    // draggingEnabled
    var robot = r1.location;
    
    var newX = robot.x;
    var newY = robot.y;

    //!!!Don't know if this is a strict check for only grab mode, or whether other actions might also make this true.
    // Also checks for existence of P1.
    var bool_GrabMode = ((primitiveActions.fromDistance && geoApp.getObjectType("P1").toLowerCase() == "point") ? true : false);

    var tempString = "";

    if(parameter) {
        parameter = Number(parameter);
    }

    //If its a move
    if(operation.indexOf("move") != -1) {
        newX = Math.round((robot.x + xDist(parameter, r1.orientation))*100000)/100000;
        newY = Math.round((robot.y + yDist(parameter, r1.orientation))*100000)/100000;

        console.dir("primitiveActions.movingPointBase : " + primitiveActions.movingPointBase);

        if(bool_GrabMode) {//not sure if this is correct
            var grabbedPoint = controller.getPoint("P1");//!!!Bad assumption, need to take care of this and properly find the grabbed point.
            var newP1X = Math.round((grabbedPoint.x + xDist(parameter, r1.orientation))*100000)/100000;
            var newP1Y = Math.round((grabbedPoint.y + yDist(parameter, r1.orientation))*100000)/100000;

            tempString = "P1," + newP1X + "," + newP1Y;

            for(var i = 0 ; i <= pF.currPointNum ; i++) {
                if(i != 1 && geoApp.getObjectType("P"+i).toLowerCase() == "point") {
                    var currPointDet = controller.getPoint("P"+i);
                    tempString += ":P" + String(i) + "," + currPointDet.x + "," + currPointDet.y;
                }
            }

            console.dir("##Inside##");
        }
        else {
            for(var i = 0 ; i <= pF.currPointNum ; i++) {
                if(geoApp.getObjectType("P"+i).toLowerCase() == "point") {
                    var currPointDet = controller.getPoint("P"+i);
                    tempString += ":P" + String(i) + "," + currPointDet.x + "," + currPointDet.y;
                }
            }
        }
    }
    
    finalState.string = "R," + newX + "," + newY + "," + r1.orientation + (tempString ? tempString : "");

    // If it is a plot point
    if(operation.indexOf("plotPoint") != -1) {
        var newPoint = "P" + pF.currPointNum;
        var newPointX = robot.x;
        var newPointY = robot.y;

        for(var i = 0 ; i < pF.currPointNum ; i++) {
            if(geoApp.getObjectType("P"+i).toLowerCase() == "point") {
                var currPointDet = controller.getPoint("P"+i);
                finalState.string += ":P" + String(i) + "," + currPointDet.x + "," + currPointDet.y;
            }
        }
        
        finalState.string += ":" + newPoint + "," + newPointX + "," + newPointY;
    }

    // If it is a turn
    if(operation.indexOf("turn") != -1) {
        newX = robot.x;
        newY = robot.y;

         if(bool_GrabMode) {//not sure if this is correct
            //Copied this from the turnAngle function from Action.js
            var r = controller.getPoint("R");
            var grabbedPoint = controller.getPoint(primitiveActions.movingPointBase);
            ex = r1.getExtension(primitiveActions.movingPointBase);
            var dist = r.distanceTo(grabbedPoint);
            var orient = r1.orientation + ex.angleDelta + parseInt(parameter);
            orient = orient == 360 ? 0 : orient;
            var newP1X  = (r.x + xDist(dist, orient)).toFixed(2);
            var newP1Y = (r.y + yDist(dist, orient)).toFixed(2);

            // var grabbedPoint = controller.getPoint("P1");//!!!Bad assumption, need to take care of this and properly find the grabbed point.
            // var newP1X = Math.round((grabbedPoint.x + xDist(parameter, r1.orientation))*100000)/100000;
            // var newP1Y = Math.round((grabbedPoint.y + yDist(parameter, r1.orientation))*100000)/100000;

            tempString = "P1," + newP1X + "," + newP1Y;

            for(var i = 0 ; i <= pF.currPointNum ; i++) {
                if(i != 1 && geoApp.getObjectType("P"+i).toLowerCase() == "point") {
                    var currPointDet = controller.getPoint("P"+i);
                    tempString += ":P" + String(i) + "," + currPointDet.x + "," + currPointDet.y;
                }
            }

            console.dir("##Inside##");
        }
        else {
            for(var i = 0 ; i <= pF.currPointNum ; i++) {
                if(geoApp.getObjectType("P"+i).toLowerCase() == "point") {
                    var currPointDet = controller.getPoint("P"+i);
                    tempString += ":P" + String(i) + "," + currPointDet.x + "," + currPointDet.y;
                }
            }
        }
        
        var finalRot = Number(r1.orientation) + parameter;

        finalState.string = "R," + newX + "," + newY + "," + finalRot + (tempString ? tempString : "");
    }


    console.dir("finalState : " + JSON.stringify(finalState));

    return finalState;
}

//!!DO NOT CALL ANY LOG FUNCTIONS IN HERE; ONLY console.log/dir
function getGeogebraStatus() {
    var statusObject = {"string":"","state":{}};
    var statusString = "";
    var otherPointsString = "";
    
    if(currentProblem) {
        // statusString += currentProblem.name + ":"//should be of the form "problem ##"

        var no_of_objects = geoApp.getObjectNumber();
        var robotPointName = "R";
        var pointList = [];
        for(var i = 0 ; i < no_of_objects ; i++) {
            var objectName = geoApp.getObjectName(i);
            
            // console.dir("objectName : " + objectName,{"source":__SOURCE__});
            
            if(geoApp.getObjectType(objectName).toLowerCase() == "point" && pointList.indexOf(objectName) == -1 && objectName.toLowerCase() != "e") {
                if(objectName.toLowerCase() == robotPointName.toLowerCase()) {
                    // var robotStatusString = "robot(" + r1.location.x + "," + r1.location.y + "," + r1.orientation + "deg)";
                    var robotStatusString = "R," + r1.location.x + "," + r1.location.y + "," + r1.orientation + ":";
                    statusObject.state.robot = {"x":r1.location.x,"y":r1.location.y,"rot":r1.orientation};
                }
                else {
                    pointList.push(objectName);
                    var actualX = geoApp.getXcoord(objectName).toFixed(2);
                    var actualY = geoApp.getYcoord(objectName).toFixed(2);
                    // statusString += objectName + "(" + actualX + "," + actualY + "):"
                    otherPointsString += objectName + "," + actualX + "," + actualY + ":";
                    statusObject.state[objectName] = {"x":actualX,"y":actualY};
                }
            }
            else {
                // console.dir("Ignored " + objectName,{"source":__SOURCE__});
            }
        }

        // statusString += robotStatusString + ":" + "drag " + (draggingEnabled ? "ON" : "OFF") + ":" + "???see steps on???" + ":" + 
        // "???condition (e.g., virtual, virtualTAG, robotTAG)???" + ":" + "???user???";

        statusString += robotStatusString + otherPointsString;

        // r1.location;
        // r1.orientation;
        // (draggingEnabled ? "ON" : "OFF");
        // see steps on
        // condition (e.g., virtual, virtualTAG, robotTAG)
        // user

        // “problem 1; P1(2,3); robot(0,0,0deg); drag on; see steps on; cond virtualTAG”

        // problem #
        // points
        // virtual robot position and orientation
        // drag off/on
        // see steps off/on
        // condition (e.g., virtual, virtualTAG, robotTAG)
        // user
    }
    
    // statusString = "\"" + statusString + "\"";
    statusObject.string = statusString;
    // return statusString;
    return statusObject;
}

function sendDataToMobile(data) {
 // Logging in server
    $.ajax({
        url: ADR.SEND_DATA_TO_MOBILE + "?data=" + JSON.stringify(data),
        success: function(data) {
            console.dir("Event '" + JSON.stringify(data) + "' LOGGED!");
        }
    });
}