var Rover = require('./Rover');


var rover = new Rover();
rover.Init(Start);
 



function Start(){  
  console.log('rover heading:' + rover.GetHeading()); 
 rover.SetHeading(270,true, function(){'Found Heading!'});
 
}

 

 process.on('exit', function(code) {
   rover.Stop();
   console.log('exit ');
 });

 process.on('uncaughtException', function(err) {
   rover.Stop();
  console.log('Caught exception: ' + err);
});