 
var RotateToHeading = require('./manueverLib/RotateToHeading.js');
var ForwardAtHeading = require('./manueverLib/ForwardAtHeading.js');
var Square = require('./manueverLib/Square.js');

var Manuevers = function() {
	var currentManuever = {};
	 
	
	return {
		StopCurrentManuever : function(){
			if (currentManuever != null && typeof currentManuever.Stop == 'function'){
				currentManuever.Stop();
			}
		},
		 
 
		
		/*
			description: turns rover to heading
			options:
				TargetHeading : default current heading
				MaintainHeading: defualt false
				
		*/
		RotateToHeading : function(rover, options, callBack){
			this.StopCurrentManuever();
			currentManuever = null;
			currentManuever = new RotateToHeading(rover);
			currentManuever.Execute(options, callBack);
		},
		
		/*
			descprtion: moves forward following heading
			options:
				TargetHeading : default current heading
		*/
		ForwardAtHeading: function(rover, options, callBack){
			this.StopCurrentManuever();
			currentManuever = null;
			currentManuever = new ForwardAtHeading(rover);
			currentManuever.Execute(options, callBack);
		},
		
		Square: function(rover, options, callBack){
			this.StopCurrentManuever();
			currentManuever = null;
			currentManuever = new Square(rover);
			currentManuever.Execute(options, callBack);
		}
	}
}

module.exports = Manuevers;