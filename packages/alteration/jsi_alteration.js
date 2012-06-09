/** Lightweight package to handle form data alteration.
 *
 * @project jsi:javascript.interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 *
 * @package alteration
 * @dependencies dhtml
 */

alert("Alteration: untested");


jsi.alteration.Alteration()
{	
	this.children = new Array(); 
}

	
	jsi.alteration.Alteration.prototype.addChild = function(newAlteration) 
	{
		this.children[this.children.length] = newAlteration;
	}
	
	jsi.alteration.Alteration.prototype.execute = function() 
	{
		for (var i in this.children) 
		{
			this.children[i].alter();
		}
		
	}



/** A basic alteration, modifying to some format string
 *
 * @param formItem (Element) The item to modify
 * @param format (String) The format string to modify by. Each 
 *						  argument should be represented by "%n" 
 *					      where n is the number of the 
 *						  current argument to insert
 * @param args (Element) The array of elements used in format
 * @param alterIfUnseen (boolean, default = FALSE)
 */
jsi.alteration.AlterElement = function(element, format, args, alterIfUnseen)
{
	this.element = element; 
	
	this.format = format;
	
	this.args = args; 
	
	this.alterIfUnseen;
	
	
	if (alterIfUnseen != null)
	{
	    this.alterIfUnseen = alterIfUnseen;
	}
	else
	{
	    this.alterIfUnseen = false;
	}

}
	
	//modify the form item to the specified format
	jsi.alteration.AlterElement.prototype.alter = function() 
	{
		if (!this.alterIfUnseen && !this.element.canBeSeen()) 
		{
			return false;
		}
		
		var str = this.format; 
		
		for (var y in this.args) 
		{
			str = str.replace("%"+y, this.args[y].getValue());
		}
		
		this.element.setValue(str);
		
		return true;
	}	




jsi.alteration.AlterMultichoice = function(element, correctValue, formatRight, formatWrong, alterIfUnseen) 
{

    this.element = element; 
	
	this.correctValue = correctValue; 
    	
	this.formatRight = formatRight; 
	
	this.formatWrong = formatWrong;
	
	this.alterIfUnseen;
	
	if (alterIfUnseen != null)
	{
	    this.alterIfUnseen = alterIfUnseen;
	}
	else
	{
	    this.alterIfUnseen = false;
	}
}


jsi.alteration.AlterRadio = function(element, correctValue, formatRight, formatWrong, alterIfUnseen) 
{
    jsi.alteration.AlterMultichoice.call(this, element, correctValue, formatRight, formatWrong, alterIfUnseen);
}
   
    jsi.alteration.AlterRadio.prototype = jsi.alteration.AlterMultichoice.prototype;
    
    //modify the form item to the specified format
	jsi.alteration.AlterRadio.prototype.alter = function() 
	{
	    
		if (!this.alterIfUnseen && !this.element.canBeSeen()) 
		{
			return false;
		}
	    
	    var radio_btn = this.element.getSelected();
	    
	    if (radio_btn.getValue() == this.correctValue)
	    {
	        radio_btn.setValue(this.correctValue + this.formatRight);
	    }
	    else
	    {
	        var str = this.formatWrong;
	        radio_btn.setValue(radio_btn.getValue() + str.replace("%c",this.correctValue));
	    }
	    
	    return true; 
	}	


jsi.alteration.AlterCheckbox = function(element, correctValue, formatRight, formatWrong, alterIfUnseen, hiddenField) 
{
    jsi.alteration.AlterMultichoice.call(this, element, correctValue, formatRight, formatWrong, alterIfUnseen);
    
    this.hiddenField = hiddenField;
}
    
    jsi.alteration.AlterCheckbox.prototype = jsi.alteration.AlterMultichoice.prototype;
   
    
    //modify the form item to the specified format
	jsi.alteration.AlterCheckbox.prototype.alter = function() 
	{
	    
		if (!this.alterIfUnseen && !this.element.canBeSeen()) 
		{
			return false;
		}
		
		if (this.hiddenField.getValue() == this.correctValue())
		{
		    this.hiddenField.setValue(this.correctValue + this.formatRight);
		}
		else
		{
		    var str = this.formatWrong;
		    this.hiddenField.setValue(this.hiddenField.getValue() + str.replace("%c",this.correctValue));
		}
		
		return true;
    }