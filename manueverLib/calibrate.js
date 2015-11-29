var angles = require('./../angles')();

var Calibrate = function(rover, options, callback){
 	 
	
	 
	var startHeadingRight;
	var endHeadingRight;
	var endHeadingLeft;
	 
	 this.init = function(){		
		startHeadingRight = rover.compass.heading; 
		rover.RotateRight();
		setTimeout(rotateRightComplete, 500);	
	}
	
	var rotateRightComplete = function(){
		rover.Stop();
		endHeadingRight = rover.compass.heading; 
		rover.degreePerSecond = angles.HowMuchRightTurn(startHeadingRight,endHeadingRight) * 2;
		rover.RotateLeft();
		setTimeout(rotateLeftComplete, 500);
	}
	
	var rotateLeftComplete = function(){
		rover.Stop();
		endHeadingLeft = rover.compass.heading; 
		rover.degreePerSecond = (rover.degreePerSecond + angles.HowMuchLeftTurn(endHeadingRight,endHeadingLeft) * 2)/2;
		console.log('calibrate:' + rover.degreePerSecond) 
		callback(null, rover.degreePerSecond);
		 
	}
	 
  
}
Calibrate.prototype = {
	Execute : function(){
		 this.init();
	}	
}

module.exports = Calibrate;