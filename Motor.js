var Gpio = require('onoff').Gpio;

 
var MotorDirection = {
  STOP: 0,
  FORWARD: 1,
  BACK: 2,
  
};

var GPIOValue = {
	HIGH : 1,
	LOW : 0
}

function Motor(ForwardPin, BackPin){
	this.foward_pin = new Gpio(ForwardPin,'out');
	this.back_pin = new Gpio(BackPin,'out');
	this.foward_pin_value = GPIOValue.LOW;
	this.back_pin_value = GPIOValue.LOW;
	this.motor_change_direction = false;
	this.motor_direction = MotorDirection.STOP;
	
	
}

Motor.prototype = {
	
	setMotorDirection(Direction){
		if(this.motor_direction !== Direction){
			
			this.motor_direction = Direction;
			this.motor_change_direction = true;
			
			if (Direction == MotorDirection.FORWARD){
				this.foward_pin_value = GPIOValue.LOW;
				this.back_pin_value  =  GPIOValue.HIGH;
			}else if(Direction == MotorDirection.BACK){
				this.foward_pin_value =  GPIOValue.HIGH;
				this.back_pin_value =  GPIOValue.LOW;
			
			}else if(Direction == MotorDirection.STOP){
				this.foward_pin_value =  GPIOValue.LOW;
				this.back_pin_value =  GPIOValue.LOW;
			}
			
			this.foward_pin.writeSync(this.foward_pin_value);
			this.back_pin.writeSync(this.back_pin_value);
			this.motor_change_direction =false;
		}
	} 
}

var obj ={
	Motor : Motor,
	MotorDirection : MotorDirection
}
module.exports = obj;
