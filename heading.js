var Raspi = require('raspi-io');
var five = require('johnny-five');
var Emitter = require("events").EventEmitter
var util = require("util")

var board = new five.Board({
  io: new Raspi(),
  repl : false
});

var compass = new five.Compass({
		controller: "HMC5883L"
  });

board.on("ready", function() {
   
  
});
 

module.exports = compass;