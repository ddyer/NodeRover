var Rover = require('./Rover');


var rover = new Rover();
rover.Init(Start);
 



function Start(){  
  console.log('rover heading:' + rover.GetHeading()); 
  rover.SetHeading(270,function(){  console.log('rover heading:' + rover.GetHeading());})
}



 