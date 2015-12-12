var angles = require('./../angles')();
var RotateToHeading = require('./RotateToHeading.js');


var ForwardAtHeading = function(rover){

	this.rover = rover;
	this.TimeSpan = 1;
	this.completedManuever= false;
	this.foundHeading = false;
	  
}


ForwardAtHeading.prototype = {
	Execute : function(options, callBack){
		this.completedManuever = false;
		this.options = this.options || options;
		this.callBack = callBack;		
		this._init(this);		
	},
	
	Stop : function(){
		this._completeForward();
	},
	
	_init : function(){
		 	
	  	this.TargetHeading = (this.options && this.options.TargetHeading) || this.rover.compass.heading;
		this.TimeSpan = (this.options && this.options.TimeSpan) || 60;
 
		var self = this;  
		var rotate = new RotateToHeading(this.rover);
		rotate.Execute({TargetHeading: this.TargetHeading}, function(){self._moveForward.call(self);});
		
	},
	
	_moveForward: function(){
		console.log('MoveFoward');
		// now that we are faceing the right direction lets go
		var self = this;
		this.rover.Forward();
		setTimeout(function(){self._completeForward.call(self);}, (this.TimeSpan * 1000) );
		this.checkHeadingDelegate = function checkHeading(){self._headingchange.call(self);};		 
		this.rover.compass.on('data', this.checkHeadingDelegate);
		this.rover.compass.removeAllListeners('data');
		self.foundHeading = true;
	},
	
	_completeForward : function(){
		
		if(!this.completedManuever){
			var self = this;
			this.completedManuever = true;
			console.log('remove listeners'); 
			this.rover.compass.removeListener('data',this.checkHeadingDelegate);
			
			this.rover.Stop(function(){
				if(self.callBack){
					self.callBack();
				}
			});
		}
	},
	
	_headingchange : function(){

		if (!this.completedManuever && this.foundHeading){
			var currentHeading = this.rover.compass.heading;			
			if (!(currentHeading > (this.TargetHeading - 5) && currentHeading < (this.TargetHeading + 5))){
				console.log('_headingchange ' + currentHeading + ' ' + this.TargetHeading);				
				this.foundHeading  = false; 
				this._makeTurn.call(this);
			}
		}
	},
	
	
	_makeTurn : function(){
 		var currentHeading = this.rover.compass.heading;
		var self = this;
		
		if (!(currentHeading > (this.TargetHeading - 5) && currentHeading < (this.TargetHeading + 5))){
 		 	console.log('ForwardAtHeading.MakeTurn:' + currentHeading + '   :   ' + this.TargetHeading);	 	
			var turnDegrees = this.rover.getTurnDegrees(this.TargetHeading, currentHeading);
			var timeToTurn =Math.abs(this.rover.GetTurnTime(turnDegrees));
 
			if (turnDegrees > 0){
				this.rover.setLeftMotor(1);
				this.rover.setRightMotor(0);
				console.log('adjust right: ' + timeToTurn);
			}else{
				this.rover.setLeftMotor(0);
				this.rover.setRightMotor(1);				
				console.log('adjust left: ' + timeToTurn);
			}
			
			
			setTimeout(function(){
				self.rover.Stop(function(){self._makeTurn.call(self)});				
			}, timeToTurn);
			
		}else{
			this.rover.Forward();
			this.foundHeading = true; 
		}
	}
}

module.exports = ForwardAtHeading;