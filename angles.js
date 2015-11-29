var Angles = function(){
	
	return{
		HowMuchRightTurn : function(StartAngle, EndAngle){
			var rtn;
			if (StartAngle > EndAngle){
				rtn = (360 - StartAngle) + EndAngle;			
			}else{
				rtn = EndAngle - StartAngle;
			}		
			return rtn;
		},
		
		HowMuchLeftTurn : function(StartAngle, EndAngle){
			var rtn;
			if (StartAngle > EndAngle){
				rtn = StartAngle - EndAngle;
			}else{
				rtn = StartAngle + (360 - EndAngle);
			}
			return rtn;
		}
	}
	
}

 
module.exports = Angles;