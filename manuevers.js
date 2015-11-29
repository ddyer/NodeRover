var Calibrate = require('./manueverLib/calibrate.js');
var RotateToHeading = require('./manueverLib/rotateToHeading.js');

var Manuevers = function() {
	return {
		calibrate : function(rover, options, callback){			 
			var calibrate = new Calibrate(rover,options, callback);
			calibrate.Execute();
		},
		/*
			options:
			TargetHeading
		*/
		rotateToHeading : function(rover, options, callback){			 
			var calibrate = new RotateToHeading(rover,options, callback);
			calibrate.Execute();
		}
	}
}

module.exports = Manuevers;