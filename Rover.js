var Motor = require('./Motor.js').Motor;
var MotorDirection = require('./Motor.js').MotorDirection;
var heading = require('./heading');
var manuevers = require('./manuevers')();
var Calibrate = require('./Calibrate.js');


function Rover(){
	this.leftMotor = new Motor(5,6);
	this.rightMotor = new Motor(22,27); 
	this.compass = heading;	
	this.calibrate = new Calibrate(this,{});
			
			
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
	
	/*
	// when the rover is initialize calibrate to determine how long it takes to 
	// make a turn
	*/
	Init : function(callback){
		var self = this;
		this.Stop(				
				function(){self.Calibrate(callback);}
			);
		 
	},
	
	/*
	// set the rover to go foward
	*/
	Forward : function(){
		this.rightMotor.setMotorDirection(MotorDirection.FORWARD);
		this.leftMotor.setMotorDirection(MotorDirection.FORWARD);
		this.Move();	
	},
	
	/*
	// set the rover to go back
	*/
	Back : function(){
		this.rightMotor.setMotorDirection(MotorDirection.BACK);
		this.leftMotor.setMotorDirection(MotorDirection.BACK);
		this.Move();	
	},
	/*
	// set the rover to stop
	*/
	Stop : function(callback, pause){ 
		pause = pause || 10;
		this.rightMotor.setMotorDirection(MotorDirection.STOP);
		this.leftMotor.setMotorDirection(MotorDirection.STOP);
		this.Move();
		if(callback){
			setTimeout(callback,pause);
		}
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
		 
	},
	
	GetHeading : function(){
		return this.compass.heading;		
	},
	
	Calibrate : function(callback){
		this.calibrate.Execute(callback); 
	},
	GetTurnTime : function(turnDegrees){
		return this.calibrate.GetTurnTime(turnDegrees);
	},
 
	SetHeading : function(TargetHeading,MaintainHeading, callBack){
		manuevers.RotateToHeading(this,{TargetHeading: TargetHeading,MaintainHeading:MaintainHeading },callBack);		
	},
	
	MoveForwardSameHeading : function(TimeSpanSeconds,Heading, callBack){
		Heading = Heading || this.GetHeading();
		manuevers.ForwardAtHeading(this, {TimeSpan: TimeSpanSeconds, TargetHeading: Heading},callBack);
	},
	
	Square : function(){
		manuevers.Square(this);
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
