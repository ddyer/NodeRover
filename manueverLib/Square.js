var angles = require('./../angles')();
var ForwardAtHeading = require('./ForwardAtHeading.js');

var Square = function(rover){
	
	this.rover = rover;
	this.ForwardAtHeading = new ForwardAtHeading(rover);
 
}

Square.prototype = {
	Execute : function(options, callBack){
		var self = this;
		this.size = (this.options && this.options.Size) || 1;
		this.callBack = callBack;
		
		this.ForwardAtHeading.Execute({TargetHeading: 0, TimeSpan : this.size}, function(){self.firstSideDone.call(self)});
	},
	Stop : function(){
		var self = this;
		this.rover.Stop(function(){
			if (self.callBack){
				self.callBack();
			}	
		});
	},
	firstSideDone : function(){
		var self = this;
		this.ForwardAtHeading.Execute({TargetHeading: 90, TimeSpan : this.size}, function(){self.secondSideDone.call(self)});
	},
	secondSideDone : function(){
		var self = this;
		this.ForwardAtHeading.Execute({TargetHeading: 180, TimeSpan : this.size}, function(){self.thirdSideDone.call(self)});
	},
	thirdSideDone : function(){
		var self = this;
		this.ForwardAtHeading.Execute({TargetHeading: 270, TimeSpan : this.size},  function(){self.Stop.call(self)});
	}
}

module.exports = Square;