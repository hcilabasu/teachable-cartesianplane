/* Function to check what kind of Mistake was made when an incorrect solution is checked
   Created by Abha */

fucntion incorrectcheck(orgX, orgY, plotX, plotY)
{
	if((orgX < 0 && plotX >= 0) || (orgX >= 0 && plotX < 0))
	{
	   if(((orgX * -1) == plotX) || ((plotX * -1) == orgX))
	   {
	      return "Sign";
	   }
	}
	else if((orgY < 0 && plotY >= 0) || (orgY >= 0 && plotY < 0))
	{
	   if(((orgY * -1) == plotY) || ((plotY * -1) == orgY))
	   {
	      return "Sign";
	   }
	}
	else if((orgX == plotY) || (orgY == plotX))
	{
	   return "Flip";
	}
	else if((orgX < 0 && plotY >= 0) || (orgX >= 0 && plotY < 0))
	{
	  if(((orgX * -1) == plotY) || ((plotY * -1) == orgX))
	   {
             return "Flip";
	   }
	}
	else if((orgY < 0 && plotX >= 0) || (orgY >= 0 && plotX < 0))
	{
	  if(((orgY * -1) == plotX) || ((plotX * -1) == orgY))
	   {
             return "Flip";
	   }
	}
	if(orgX >= 0 && orgY >= 0)
	{
	   if(plotX >= 0 && plotY >= 0)
	   {
	      if(((orgX + 1) == plotX) || ((orgY + 1) == plotY)) 
	       {
		   return "Offbyone";
		}
	   }			
	}
	if(orgX < 0 && orgY < 0)
	{
	   if(plotX < 0 && plotY < 0)
	   {
	      if(((orgX - 1) == plotX) || ((orgY - 1) == plotY)) 
	       {
		   return "Offbyone";
		}
	   }			
	}
	if((orgX < 0 && plotX >= 0) || (orgY < 0 && plotY >= 0))
	{
           if((((orgX - 1) * -1) == plotX) || (((orgY - 1) * -1) == plotY)) 
	   {
		   return "Offbyone";
	   }			
	}
	if((orgX >= 0 && plotX < 0) || (orgY >= 0 && plotY < 0))
	{
           if((((PlotX + 1) * -1) == orgX) || (((plotY + 1) * -1) == orgY)) 
	   {
		   return "Offbyone";
	   }			
	}
	else
	{
	   return "General";
	}

}

