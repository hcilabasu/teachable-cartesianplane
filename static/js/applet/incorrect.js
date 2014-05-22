/* Function to check what kind of Mistake was made when an incorrect solution is checked
   Created by Abha */

function incorrectcheck(orgx, orgy, plotx, ploty)
{
	var orgX,orgY,plotX,plotY;
	orgX = parseInt(orgx,10);
	orgY = parseInt(orgy,10);
	plotX = parseInt(plotx,10);
	plotY = parseInt(ploty,10);
	console.log("org X"+orgX+"org Y"+orgY+"plot X"+plotX+"plot Y"+plotY);

	if((orgX > 0 && plotX == 0) || (orgX < 0 && plotX == 0))
	{
		return "Nomoveonx";
		console.log("Error Type No move on X");
	}
	else if((orgY > 0 && plotY == 0) || (orgY < 0 && plotY == 0))
	{
		return "Nomovey";
		console.log("Error Type No move on Y");
	}
	else if((orgX < 0 && orgY < 0) && (plotX > 0 && plotY > 0))
	{
	   if(((orgX * -1) == plotX) && ((orgY * -1) == plotY))
	   {
	      return "Sign";
	      console.log("Error Type Sign");
	   }
	}
	else if((orgX >= 0 && orgY >= 0) && (plotX < 0 && plotY < 0))
	{
	   if(((plotY * -1) == orgY) || ((plotX * -1) == orgX))
	   {
	      return "Sign";
	      console.log("Error Type Sign");
	   }
	}
	else if(((orgX * -1) == plotX) && ((orgY * -1) == plotX ))
	{
	      return "Sign";
	      console.log("Error Type Sign");
	}
	else if((orgX == plotY) && (orgY == plotX))
	{
	   return "Flip";
	   console.log("Error Type Flip");
	}
	else if((orgX < 0 && plotY > 0) && (orgY > 0 && plotX < 0))
	{
	  if(((orgX * -1) == plotY) && ((plotX * -1) == orgY))
	   {
             return "Flip";
             console.log("Error Type Flip");
	   }
	}
	else if((orgY < 0 && plotX >= 0) && (orgX >= 0 && plotY < 0))
	{
	  if(((orgY * -1) == plotX) && ((plotY * -1) == orgX))
	   {
             return "Flip";
             console.log("Error Type Flip");
	   }
	}
	else if((orgX >= 0) && (orgY >= 0))
	{
	   if((plotX >= 0) && (plotY >= 0))
	   {
	   	   if(((orgX - 1) == plotX) || ((orgY - 1) == plotY)) 
	       {
		      return "Offbyone";
		      console.log("Error Type OffbyOne");
		   }
	       else if(((orgX + 1) == plotX) || ((orgY + 1) == plotY)) 
	       {
		      return "Offbyone";
		      console.log("Error Type OffbyOne");
		   }
	   }			
	}
	else if((orgX < 0) && (orgY < 0))
	{
	   if((plotX < 0) && (plotY < 0))
	   {
	      if(((orgX - 1) == plotX) || ((orgY - 1) == plotY)) 
	       {
		      return "Offbyone";
		      console.log("Error Type OffbyOne");
		   }
		   else if(((orgX + 1) == plotX) || ((orgY + 1) == plotY)) 
	       {
		      return "Offbyone";
		      console.log("Error Type OffbyOne");
		   }
	   }			
	}
	else if((orgX < 0 && plotX >= 0) || (orgY < 0 && plotY >= 0))
	{
       if((((orgX - 1) * -1) == plotX) || (((orgY - 1) * -1) == plotY)) 
	   {
		   return "Offbyone";
		   console.log("Error Type OffbyOne");
	   }			
	}
	else if((orgX >= 0 && plotX < 0) || (orgY >= 0 && plotY < 0))
	{
        if((((plotX + 1) * -1) == orgX) || (((plotY + 1) * -1) == orgY)) 
	   {
		   return "Offbyone";
		   console.log("Error Type OffbyOne");
	   }			
	}
	else if(orgX == 0)
	{
		if(((orgY + 1) == plotY) || ((orgY - 1) == plotY))
		{
			return "Offbyone";
			console.log("Error Type OffbyOne");
		}
	}
	else if(orgY == 0)
	{
		if(((orgX + 1) == plotX) || ((orgX - 1) == plotX))
		{
			return "Offbyone";
			console.log("Error Type OffbyOne");
		}
	}
	else
	{
	   return "General";
	   console.log("Error Type General");
	}

}