var RealRobot = function(){

	var URL = 'http://localhost:8000/mobileinterface/robot/'

	/*
	 * Moves the robot to a specific x, y and angle. Can move either backward or forward
	 */
	var moveTo = function(x_p, y_p, backwards_p, angle_p){
		var params = {
			x: x_p,
			y: y_p,
		};
		if (backwards_p === true){
			params.backwards = true;
		}
		if (angle_p !== undefined){
			params.angle = angle_p;
		}
		makeCall('move_to', params);
	}

	/*
	 * Turns the robot to a specific direction
	 */
	var turnTo = function(angle_p, backwards_p){
		var params = {
			angle: angle_p
		};
		if (backwards_p === true){
			params.backwards = true;
		}
		makeCall('turn_to', params);
	}

	/*
	 * Moves the robot back to the origin, facing the initial direction
	 */
	var reset = function(){
		moveTo(0,0,false,0);
	}

	/*
	 * Makes the AJAX call to the necessary resource
	 */
	var makeCall = function(action, params){
		$.ajax({
			url: URL + action,
			data: params
		}).done(function(data){
			console.dir("It moves! IT MOVES!!!");
		});
	}

	// Returning public object
	return {
		moveTo: moveTo,
		turnTo: turnTo,
		reset: reset
	}
}

// Instantiating object
var realRobot = RealRobot();