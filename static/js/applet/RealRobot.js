var RealRobot = function() {

	var moveRobot = false;
	var setOrigin = false;

	var URL = 'http://localhost:8000/mobileinterface/robot/'

	/*
	 * Moves the robot to a specific x, y and angle. Can move either backward or forward
	 */
	var moveTo = function(x_p, y_p, backwards_p, angle_p, nopause) {
		console.dir("Moving robot to (" + x_p + "," + y_p + "), BACKWARDS: " + backwards_p + ", ANGLE: " + angle_p);
		var params = {
			x: x_p,
			y: y_p,
		};
		
		if(backwards_p === true) {
			params.backwards = true;
		}
		
		if(angle_p !== undefined) {
			params.angle = angle_p;
		}

		if(PAUSEENABLED === true && (!nopause)){
			params.pausing = true;
		}

		makeCall('move_to', params);
	}

	/*
	 * Turns the robot to a specific direction
	 */
	var turnTo = function(angle_p, backwards_p) {
		console.dir("Turning robot to ANGLE: " + angle_p + ", BACKWARDS: " + backwards_p);
		var params = {
			angle: angle_p
		};
		
		if(backwards_p === true) {
			params.backwards = true;
		}
		makeCall('turn_to', params);
	}

	var plotPoint = function() {
		console.dir("REAL ROBOT: Plotting point");
		makeCall('plot_point');
	}

	/*
	 * Moves the robot back to the origin, facing the initial direction
	 */
	var reset = function() {
		console.dir("Resetting robot");
		moveTo(0,0,false,0, true);
	}

	/*
	 * Makes the AJAX call to the necessary resource
	 */
	var makeCall = function(action, params){
		if(moveRobot) {
			$.ajax({
				url: URL + action,
				data: params
			}).done(function(data){
				console.dir("It moves! IT MOVES!!!");
			});
		}
	}

	// Function used to attach or detach real robot from application
	var toggleRobot = function() {
		moveRobot = !moveRobot;
		console.dir(moveRobot ? "Robot WILL move" : "Robot will *NOT* move");
		return moveRobot;
	}

	var isRobotEnabled = function() {
		return moveRobot;
	}

	// Returning public object
	return {
		moveTo: moveTo,
		turnTo: turnTo,
		reset: reset,
		toggleRobot: toggleRobot,
		plotPoint: plotPoint,
		isRobotEnabled: isRobotEnabled
	}
}

// Instantiating object
var realRobot = RealRobot();