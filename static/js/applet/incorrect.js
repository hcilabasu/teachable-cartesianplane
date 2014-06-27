/* Function to check what kind of Mistake was made when an incorrect solution is checked
   Created by Abha */
var count = 0;
function incorrectcheck(orgx, orgy, plotx, ploty)
{
	var orgX,orgY,plotX,plotY;
	orgX = parseInt(orgx,10);
	orgY = parseInt(orgy,10);
	plotX = parseInt(plotx,10);
	plotY = parseInt(ploty,10);
	console.log("org X"+orgX+"org Y"+orgY+"plot X"+plotX+"plot Y"+plotY);

	if(orgX > 0 && plotX == 0 && plotY != orgX)
	{
		return "Nomoveonxplus";
		console.log("Error Type No move on X");
	}
	else if(orgX < 0 && plotX == 0 && plotY != orgX)
	{
		return "Nomoveonxneg";
		console.log("Error Type No move on X");
	}
	else if(orgY > 0 && plotY == 0 && plotX != orgY)
	{
		return "Nomoveonyplus";
		console.log("Error Type No move on Y");
	}
	else if(orgY < 0 && plotY == 0 && plotX != orgY)
	{
		return "Nomoveonyneg";
		console.log("Error Type No move on Y");
	}
	else if((orgX * -1) == plotX)
	{
	      return "Signx";
	      console.log("Error Type Sign");
	}
	else if((orgY * -1) == plotY)
	{
	      return "Signy";
	      console.log("Error Type Sign");
	}
	else if((orgX == plotY) && (orgY == plotX))
	{
	   return "Flip";
	   console.log("Error Type Flip");
	}
	else if(((orgX * -1) == plotY) && ((orgY * -1) == plotX))
	{
             return "Flip";
             console.log("Error Type Flip");
	}
	else if((orgX >= 0) && (orgY >= 0) && (plotX >= 0) && (plotY >= 0) && ((orgX - 1) == plotX))
	{
	   return "Offbyonex";
	}
	else if((orgX >= 0) && (orgY >= 0) && (plotX >= 0) && (plotY >= 0) && ((orgX + 1) == plotX))
	{
	   return "Offbyonex";
	}
	else if((orgX >= 0) && (orgY >= 0) && (plotX >= 0) && (plotY >= 0) && ((orgY - 1) == plotY))
	{
	   return "Offbyoney";
	}
	else if((orgX >= 0) && (orgY >= 0) && (plotX >= 0) && (plotY >= 0) && ((orgY + 1) == plotY))
	{
	   return "Offbyoney";
	}
	else if((orgX < 0) && (orgY < 0) && (plotX < 0) && (plotY < 0) && ((orgX - 1) == plotX))
	{
	   return "Offbyonex";
	}
	else if((orgX < 0) && (orgY < 0) && (plotX < 0) && (plotY < 0) && ((orgX + 1) == plotX))
	{
	   return "Offbyonex";
	}
	else if((orgX < 0) && (orgY < 0) && (plotX < 0) && (plotY < 0) && ((orgY - 1) == plotY))
	{
	   return "Offbyoney";
	}
	else if((orgX < 0) && (orgY < 0) && (plotX < 0) && (plotY < 0) && ((orgY + 1) == plotY))
	{
	   return "Offbyoney";
	}
	else if(orgX < 0 && plotX >= 0 && (((orgX - 1) * -1) == plotX))
	{
	   return "Offbyonex";
	} 
        else if(orgY < 0 && plotY >= 0 && (((orgY - 1) * -1) == plotY)) 
	{
	   return "Offbyoney";			
	}
	else if(orgX >= 0 && plotX < 0 && (((plotX + 1) * -1) == orgX)) 
	{
	   return "Offbyonex";
	}
	else if(orgY >= 0 && plotY < 0 && (((plotY + 1) * -1) == orgY))
	{
	   return "Offbyoney";		
	}
	else if(orgX == 0 && ((orgY + 1) == plotY)) 
	{
	   return "Offbyoney";
	}
	else if(orgX == 0 && ((orgY - 1) == plotY)) 
	{
	   return "Offbyoney";
	}
	else if(orgY == 0 && ((orgX + 1) == plotX))
	{
	   return "Offbyonex";
	}
	else if(orgY == 0 && ((orgX - 1) == plotX))
	{
	   return "Offbyonex";
	}
	else
	{
	   return "General";
	   console.log("Error Type General");
	}

}

/****************************************
Function when the solution checked is correct
*****************************************/

function correct(orgX, orgY)
{
	if(orgX >= 0 && orgY >= 0)
	{
	   return "Firstquad";
	}
	else if(orgX < 0 && orgY >= 0)
	{
	   return "Secondquad";
	}
	else if(orgX < 0 && orgY < 0)
	{
	   return "Thirdquad";
	}
	else if(orgX >= 0 && orgY < 0)
	{
	   return "Fourthquad";
	}
}

/**********************************************
Function to check type of prompts to be displayed
within interaction.
**********************************************/

function checkmove(label, distance, Xcoord, Ycoord, anglevalue, problemnumber)
{
	console.log("Angle in incorrect" + anglevalue);
	console.log("label" + label+ "Distance"+ distance+ "Xcoord"+ Xcoord +"Ycoord"+Ycoord);
	count = count + 1;
	if (count == 3 && problemnumber <=3)
	{
		count = 1;
	}
	else if(count == 5 && problemnumber > 3)
	{
		count = 1;
	}
	if (count == 1)
	{
		if(label == "moveDistance" && anglevalue == 0)
		{
			if(distance == Ycoord)
			{
				return "flipmove";
			}
	   		else if(distance >= 0 && Xcoord >= 0)
	   		{
	   	   		return "xcorrectpos";
	   		}	
	   		else if(distance < 0 && Xcoord < 0)
	   		{
	   	   		return "xcorrectneg";
	   		}
	   		else if(distance >= 0 && Xcoord < 0)
	   		{
	   	   		return "xwrongneg";
	   		} 
	   		else if(distance < 0 && Xcoord >= 0)
	   		{
	   	   		return "xwrongpos";
	   		} 
		}
		else if(label == "moveDistance" && anglevalue == 90)
		{
			if(distance == Xcoord)
			{
				return "flipmove";
			}
	   		else if(distance >= 0 && Ycoord >= 0)
	   		{
	   	   		return "ycorrectpos";
	   		}
	   		else if(distance >= 0 && Ycoord < 0)
	   		{
	   	   		return "ywrongneg";
	   		} 
	   		else if(distance < 0 && Ycoord < 0)
	   		{
	   	   		return "ycorrectneg";
	   		}
	   		else if(distance < 0 && Ycoord >= 0)
	   		{
	   	   		return "ywrongpos";
	   		} 
		}
		else if(label == "moveDistance" && anglevalue == 180)
		{
			if(distance == Ycoord)
			{
				return "flipmove";
			}
	   		else if(distance >= 0 && Xcoord < 0)
	   		{
	   	   		return "xcorrectneg";
	   		}
	   		else if(distance < 0 && Xcoord >= 0)
	   		{
	   	   		return "xcorrectpos";
	   		}
	   		else if(distance >= 0 && Xcoord >= 0)
	   		{
	   	   		return "xwrongpos";
	   		}
	   		else if(distance < 0 && Xcoord < 0)
	   		{
	   	   		return "xwrongneg";
	   		}	 
		}
		else if(label == "moveDistance" && anglevalue == 270)
		{
			if(distance == Xcoord)
			{
				return "flipmove";
			}
	   		else if(distance >= 0 && Ycoord < 0)
	   		{
	   	   		return "ycorrectneg";
	   		}
	   		else if(distance < 0 && Ycoord >= 0)
	   		{
	   	   		return "ycorrectpos";
	   		}
	   		else if(distance >= 0 && Ycoord >= 0)
	   		{
	   	   		return "ywrongpos";
	   		} 
	   		else if(distance < 0 && Ycoord < 0)
	   		{
	   	   		return "ywrongneg";
	   		} 
		}
	}
}