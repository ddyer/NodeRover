var Motor = require('./Motor.js').Motor;
var MotorDirection = require('./Motor.js').MotorDirection;
var heading = require('./heading');
var manuevers = require('./manuevers')();



function Rover(){
	this.leftMotor = new Motor(5,6);
	this.rightMotor = new Motor(22,27); 
	this.compass = heading;	
	this.compass.on("ready", function() {
    console.log("headingchange");
    console.log("  heading : ", Math.floor(this.heading));
    console.log("  bearing : ", this.bearing.name);
    console.log("--------------------------------------");
  });
  
  this.compass.on("Closing", function() {
	  this.Stop();
  });
  
}

Rover.prototype = {
	Init : function(callback){
		var self = this;
		this.Stop(
				function(){
					self.Calibrate(callback);
				}
			);
		 
	},
	Forward : function(){
		this.rightMotor.setMotorDirection(MotorDirection.FORWARD);
		this.leftMotor.setMotorDirection(MotorDirection.FORWARD);
		this.Move();	
	},
	Back : function(){
		this.rightMotor.setMotorDirection(MotorDirection.BACK);
		this.leftMotor.setMotorDirection(MotorDirection.BACK);
		this.Move();	
	},
	Stop : function(callback, options){ 
		var pause = (options && options.pause) || 10;
		this.rightMotor.setMotorDirection(MotorDirection.STOP);
		this.leftMotor.setMotorDirection(MotorDirection.STOP);
		this.Move();
		setTimeout(callback,pause);
	},
	RotateRight: function(){ 
		this.rightMotor.setMotorDirection(MotorDirection.BACK);
		this.leftMotor.setMotorDirection(MotorDirection.FORWARD);
		this.Move();
	},
	RotateLeft: function(){ 
		this.rightMotor.setMotorDirection(MotorDirection.FORWARD);
		this.leftMotor.setMotorDirection(MotorDirection.BACK);
		this.Move();		
	},
	
	setRightMotor : function(direction){
		 this.rightMotor.setMotorDirection(direction);
		 this.Move(); 
	},
	setLeftMotor : function(direction){
		 this.leftMotor.setMotorDirection(direction);
		 this.Move();	 
	},
	Move : function(){
		this.rightMotor.Move();
		this.leftMotor.Move();
	},
	
	
	Calibrate : function(callback){
		manuevers.calibrate(this,{},callback); 
	},
	
	
	GetHeading :function(callback){
		return this.compass.heading;
	},
	SetHeading : function(TargetHeading, callBack){
		manuevers.rotateToHeading(this,{TargetHeading: TargetHeading,MaintainHeading:true},callBack);		
	},
	getTurnDegrees : function(Target,Source){
		var diff = Target - Source; 
		if (diff < -180){
			diff = (diff + 360) * -1
		}else if (diff > 0 && diff < 180){
			diff = diff * -1
		}else if (diff < 0 && diff > -180){
			diff = diff * -1
		}else if (diff > 180){
			diff = (diff - 360)  * -1
		}
		
		return diff;
	}
}

module.exports = Rover;
