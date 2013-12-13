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
        data.geo_status = getGeogebraStatus();

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
    catch(e) {
        console.dir("log function failed!!! : " + e.toString());
    }
}

//!!DO NOT CALL ANY LOG FUNCTIONS IN HERE; ONLY console.log/dir
function getGeogebraStatus() {
    var statusString = "";
    
    if(currentProblem) {
        statusString += currentProblem.name + ":"//should be of the form "problem ##"

        var no_of_objects = geoApp.getObjectNumber();
        var robotPointName = "R";
        var pointList = [];
        for(var i = 0 ; i < no_of_objects ; i++) {
            var objectName = geoApp.getObjectName(i);
            
            // console.dir("objectName : " + objectName,{"source":__SOURCE__});
            
            if(geoApp.getObjectType(objectName).toLowerCase() == "point" && pointList.indexOf(objectName) == -1 && objectName.toLowerCase() != "e") {
                if(objectName.toLowerCase() == robotPointName.toLowerCase()) {
                    var robotStatusString = "robot(" + r1.location.x + "," + r1.location.y + "," + r1.orientation + "deg)"
                }
                else {
                    pointList.push(objectName);
                    var actualX = geoApp.getXcoord(objectName).toFixed(2);
                    var actualY = geoApp.getYcoord(objectName).toFixed(2);
                    statusString += objectName + "(" + actualX + "," + actualY + "):"
                }
            }
            else {
                // console.dir("Ignored " + objectName,{"source":__SOURCE__});
            }
        }

        statusString += robotStatusString + ":" + "drag " + (draggingEnabled ? "ON" : "OFF") + ":" + "???see steps on???" + ":" + 
        "???condition (e.g., virtual, virtualTAG, robotTAG)???" + ":" + "???user???";

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
    return statusString;
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