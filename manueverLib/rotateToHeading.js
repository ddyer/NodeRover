var angles = require('./../angles')();

var RotateToHeading = function(rover, options, callBack){
 	
	var notDone = true;   
	var FinalTargetHeading;
	var foundHeading = false;
	 
	this.init = function(){		
	  	FinalTargetHeading = (options && options.TargetHeading) || rover.compass.heading;
		var currentHeading = rover.compass.heading;
		
		if((options && options.MaintainHeading) || false){
			console.log('maintaining heading');
			rover.compass.on('data', headingchange);
		}
		console.log('Turning from:' + currentHeading + ' to ' + FinalTargetHeading);
		
		MakeTurn(FinalTargetHeading,currentHeading);
	}
	
	function MakeTurn(TargetHeading, CurrentHeading){
		
		if (CurrentHeading > (TargetHeading - 10) && CurrentHeading < (TargetHeading + 10)){
			notDone = false;		 
		}
		
		if(notDone){
 		 
			var turnDegrees = rover.getTurnDegrees(TargetHeading, CurrentHeading);
			var timeToTurn =((rover.degreePerSecond / 1000) * Math.abs(turnDegrees)) * 2; 
 
			if (turnDegrees < 0)
				rover.RotateRight();
			else
				rover.RotateLeft();
			
			
			setTimeout(function(){
				rover.Stop(function(){MakeTurn(TargetHeading, rover.compass.heading)});				
			}, timeToTurn);
			
		}else{
			foundHeading = true;
			callBack();
		}
	}
	
	function headingchange(){
		 
		if (foundHeading){
			var currentHeading = this.heading;
			if (!(currentHeading > (FinalTargetHeading - 10) && currentHeading < (FinalTargetHeading + 10))){
				foundHeading  = false;
				notDone = true;
			 			 
				MakeTurn(FinalTargetHeading,currentHeading);
			}
		}
	}
	 
  
}
RotateToHeading.prototype = {
	Execute : function(){
		 this.init();
	}	
}

module.exports = RotateToHeading;