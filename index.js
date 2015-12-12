var Rover = require('./Rover');


var rover = new Rover();
rover.Init(Start);
 



function Start(){  
  console.log('rover heading:' + rover.GetHeading()); 
  //rover.SetHeading(90,false,FirstHeading);
  //rover.MoveForwardSameHeading(1.5, 90, SecondHeading );
   rover.Square();
}
function FirstDestinationMet(){
   console.log('FirstDestinationMet: rover heading:' + rover.GetHeading()); 
  rover.SetHeading(90,false,SecondHeading);
}







function FirstHeading(){ 
   console.log('FirstHeading: rover heading:' + rover.GetHeading()); 
  rover.MoveForwardSameHeading(1.5, 90, SecondHeading );
}


function SecondHeading(){
  console.log('SecondHeading:rover heading:' + rover.GetHeading());
  rover.MoveForwardSameHeading(1.5, 270, function(){console.log('done');} );
}

 process.on('exit', function(code) {
   rover.Stop();
   console.log('exit ');
 });

 process.on('uncaughtException', function(err) {
   rover.Stop();
  console.log('Caught exception: ' + err);
  console.log(err.stack);

});