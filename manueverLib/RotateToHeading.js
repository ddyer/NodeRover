var angles = require('./../angles')();

var RotateToHeading = function(rover){
 	this.rover = rover;  
}
RotateToHeading.prototype = {
	Execute : function(options, callBack){
		this.options = this.options || options;
		this.callBack = callBack;
		
		this.notDone = true;
		this.foundHeading = false;   
		this.TargetHeading = (this.options && this.options.TargetHeading) || this.rover.compass.heading;


		 this._init();
	},
	Stop : function(){
		
		if(this.checkHeadingDelegate){
			this.rover.compass.removeListener('data',this.checkHeadingDelegate);
		}
		
		if(this.callBack)
			this.callBack();
	},
	
	_init : function(){
	
		var currentHeading = this.rover.compass.heading;
 		var self = this;
		 
		if((this.options && this.options.MaintainHeading) || false){
			console.log('maintaining heading');
			
			this.checkHeadingDelegate = function checkHeading(){self._headingchange.call(self);};
			this.rover.compass.on('data', this.checkHeadingDelegate);
			console.log('RotateToHeading.checkHeadingDelegate');
		}
		
		console.log('Turning from:' + currentHeading + ' to ' + this.TargetHeading);
		
		this._makeTurn();
	},
	
	_makeTurn : function(){
		var self = this;		
		var currentHeading = this.rover.compass.heading;		
		
		if (currentHeading > (this.TargetHeading - 10) && currentHeading < (this.TargetHeading + 10)){
			this.notDone = false;		 
		}
		
		if(this.notDone){
 		    
			var turnDegrees = this.rover.getTurnDegrees(this.TargetHeading, currentHeading);
			var timeToTurn =Math.abs(this.rover.GetTurnTime(turnDegrees));
			
			if (turnDegrees > 0){
				this.rover.RotateRight();				 
			}else{
				this.rover.RotateLeft();
			}
			
			
			setTimeout(function(){
				self.rover.Stop(function(){self._makeTurn.call(self)});				
			}, timeToTurn);
			 
		}else{
			this.foundHeading = true;
			if(this.callBack)
				this.callBack();
		}
		
	},
	_headingChange : function(){
		if (this.foundHeading){
			var currentHeading = this.rover.compass.heading;
			
			if (!(currentHeading > (this.TargetHeading - 5) && currentHeading < (this.TargetHeading + 5))){
				console.log('headingchange:' + currentHeading + ':' + this.TargetHeading);
				
				this.foundHeading  = false;
				this.notDone = true;
			 			 
				this._makeTurn.call(this);
			}
		}
	}
}

module.exports = RotateToHeading;