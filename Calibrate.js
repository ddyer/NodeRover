var angles = require('./angles')();

var Calibrate = function(rover, options){
 	this.rover = rover;
	this.options = options;
}


Calibrate.prototype = {
	Execute : function(callBack){
		this.callBack = callBack;
		this.turnCalibration = new Array();		
		this._init();
	},
	ExecuteComplete : function(){ 
		this.callBack(null, this.turnCalibration);
	},
	
	GetTurnTime : function(turnDegrees){
		turnDegrees = Math.abs(turnDegrees);
		for(var i = this.turnCalibration.length -1;i>0;i--){			
			if (turnDegrees > this.turnCalibration[i].TurnDegrees){
				return this.turnCalibration[i].timeSpan;
			}
		}
		
		return 15; 
	},
	 
	_init : function(){
		var self = this;
		this.rover.RotateRight();
		setTimeout(
			function(){
				self.rover.RotateLeft();
				setTimeout(function(){self._compassCalibrateComplete.call(self)}, 1500);
		}, 1000);
	},
	
	_compassCalibrateComplete : function(){
		this._checkTime.call(this,15);
	},
	
	_checkTime : function(timeSpan){
		var self = this;
		var pauseTime = 200;
		var interval = 20;
		
		if(timeSpan > 120){
			
			this.turnCalibration.pop();
			this.rover.Stop();			 	
			console.log(this.turnCalibration);
			this.ExecuteComplete.call(this);			
			return;
		}
		
		
		this.rover.Stop(function(){
			
			
			if (self.turnCalibration.length > 0){				 
				var lastIndex = self.turnCalibration.length - 1;
				self.turnCalibration[lastIndex].endTime = new Date();
				self.turnCalibration[lastIndex].timeDiff = (self.turnCalibration[lastIndex].endTime - self.turnCalibration[lastIndex].startTime) - pauseTime;		 			
				self.turnCalibration[lastIndex].TurnDegrees = angles.HowMuchRightTurn(self.rover.compass.heading,self.turnCalibration[lastIndex].startHeading); 				
			}
			
		
			self.turnCalibration.push({startHeading : self.rover.compass.heading, startTime : new Date(),timeSpan : timeSpan });			
			self.rover.RotateRight();
			setTimeout(function(){self._checkTime.call(self,(timeSpan + interval)); }, timeSpan);
		},pauseTime);
	}
	
}

module.exports = Calibrate;