/** Generic form handler classes and methods. 
 * 
 * An OO approach to form items and their validation.
 *
 * @project jsi:javascript.interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 *
 * @package validation
 * @dependencies dhtml
 */


jsi.validation.Attributes = function()
{
}

    //for form itself - is the type of validation, 
    //currently only SUBMIT supported
    jsi.validation.Attributes.validateOn         = "jsi_validateon"; 
    
    //for all 
    jsi.validation.Attributes.type               = "jsi_validationtype";
    jsi.validation.Attributes.label              = "jsi_label";
    jsi.validation.Attributes.required           = "jsi_required";
    jsi.validation.Attributes.checkForViewable   = "jsi_checkforviewable";
    jsi.validation.Attributes.clearIfOff         = "jsi_clearifoff";
    
    jsi.validation.Attributes.compareTo          = "jsi_compareto";
    jsi.validation.Attributes.compareToText      = "jsi_comparetotext";
    
    jsi.validation.Attributes.messageObject      = "jsi_messageobject";
    jsi.validation.Attributes.messageShowType    = "jsi_messageshowtype";
    
    //for text 
    jsi.validation.Attributes.exactChars         = "jsi_exactchars";
    jsi.validation.Attributes.minChars           = "jsi_minchars";
    jsi.validation.Attributes.maxChars           = "jsi_maxchars";

    //for numeric
    jsi.validation.Attributes.minValue           = "jsi_minvalue";
    jsi.validation.Attributes.maxValue           = "jsi_maxvalue";
    
    //for date
    jsi.validation.Attributes.separator          = "jsi_separator";
    jsi.validation.Attributes.onlyPast           = "jsi_onlypast";
    jsi.validation.Attributes.onlyFuture         = "jsi_onlyfuture";
    
    //for checkbox
    jsi.validation.Attributes.exactChosen        = "jsi_exactchosen";
    jsi.validation.Attributes.minChosen          = "jsi_minchosen";
    jsi.validation.Attributes.maxChosen          = "jsi_maxchosen";
    


jsi.validation.PropertyTypes = function()
{
}
    jsi.validation.PropertyTypes.bool = 0;
    jsi.validation.PropertyTypes.string = 1;
    jsi.validation.PropertyTypes.integer = 2;
    jsi.validation.PropertyTypes.decimal = 3;


jsi.validation.Property = function(type, required, value)
{
    this.type = type;
    this.required = required;
    this.value = value;
}

jsi.validation.Properties = function(element)
{
    this.element = element; 
    
    //this.types = new _jsi_Val_ENUM_PropertyTypes();
    
    this.properties = new Array();
}

    
    jsi.validation.Properties.prototype.set = function(name, type, required, defaultVal)
    {
        this.properties[name] = new jsi.validation.Property(type,required,defaultVal);   
    }
    
    jsi.validation.Properties.prototype.get = function(name)
    {
    
        if (!this.properties[name])
        {
            throw("Validation.Properties.get(id="+this.element.id+",attribute="+name+"): The property must be initialised in the code.");
        }
        
        if (this.element.getProperty(name,false) != null) 
        {
            this.properties[name].value = this.element.getProperty(name,false);
        }
        
        //enforce required
        if (this.properties[name].required && this.properties[name].value == null)
        {
            throw("Validation.Properties.get(id="+this.element.id+",attribute="+name+"): The property is required.");
        }
        
        if (this.properties[name].value != null) 
        {
            //enforce type (done here because of exposure to types ENUM is here)
            switch (this.properties[name].type)
            {
                case (jsi.validation.PropertyTypes.integer): 
                    if (isNaN(this.properties[name].value))
                    {
                        throw("Validation.Properties.get(id="+this.element.id+",attribute="+name+"): The property must be an integer.");
                    }
                    this.properties[name].value = parseInt(this.properties[name].value);
                    break;
               case (jsi.validation.PropertyTypes.decimal): 
                    if (isNaN(this.properties[name].value))
                    {
                        throw("Validation.Properties.get(id="+this.element.id+",attribute="+name+"): The property must be a decimal.");
                    }
                    this.properties[name].value = parseFloat(this.properties[name].value);
                    break;
               case (jsi.validation.PropertyTypes.bool): 
                    if (typeof(this.properties[name].value) == "boolean")
                    {
                        break;
                    }
                    if (this.properties[name].value.toLowerCase() != "true" && this.properties[name].value.toLowerCase() != "false")
                    {
                        throw("Validation.Properties.get(id="+this.element.id+",attribute="+name+"): The property must be a boolean.");
                    }
                    this.properties[name].value = jsi.library.parseBoolean(this.properties[name].value);
                    break;
               default:
                    //string - do nothing
                    break;
            }
        }
        
        
        return this.properties[name].value;
    }
   


jsi.validation.Validation = function(formElement)
{

    this.element = formElement; 
    
    this.children = new Array();
    
    this.properties = new jsi.validation.Properties(this.element);
    
    //set default 
    this.properties.set(jsi.validation.Attributes.validateOn,
                        jsi.validation.PropertyTypes.string,
                        false,
                        "submit");
  
    jsi.validation.appendValidator(this);
}
   
    jsi.validation.Validation.prototype.addChild = function(validateObj) 
	{
	    this.children[this.children.length] = validateObj;
	}
	
	
	jsi.validation.Validation.prototype.findGroup = function(groupName)
	{
	    for (var i in this.children)
        {
            if (this.children[i].group == groupName)
            {
                return this.children[i];
            }    	        
        }
	}
	
	
	jsi.validation.Validation.prototype.validate = function(errorHeader,errorFooter) 
	{
	
	
		var errorString = "";
		
		if (!errorHeader)
		{
		    errorHeader = "The following error(s) occurred:\n";
        }
        
        if (!errorFooter)
        {
            errorFooter = "";
        }    
    
    	//loop over all validators, building an error string if any errors	
		for (var i in this.children) 
		{
			val = this.children[i];
			//alert("validating: "+this.children[i].element.id);
			
			if (!val.validate()) 
			{
				errorString += val.errMsg; 
				val.setMessageStatus(true);
			}	
			else
			{
			    //deactivate any message objects
			    val.setMessageStatus(false);
			}
		}	
			
		if (errorString != "") 
		{
			alert(errorHeader + errorString + errorFooter);
			return false;
		} 
		else 
		{
			return true;
		}
	}
	
	jsi.validation.Validation.prototype.clear = function()
	{
	    this.children = new Array();
	}
	


jsi.validation.Validate = function(type,element)
{
    
    /** PROPERTIES **/
    this.type = type;
    
    this.element = element;
    
	this.errMsg = "";
	
	//this.attributes = new _jsi_Val_ENUM_Attributes();
	
	this.properties = new jsi.validation.Properties(this.element);
    
    //Caption for the error message
    this.properties.set(jsi.validation.Attributes.label,
                        jsi.validation.PropertyTypes.string,true);
    
	//Items that aren't required, will only be checked IF they are NOT empty 
	this.properties.set(jsi.validation.Attributes.required,
	                    jsi.validation.PropertyTypes.bool,false,true);
    
	//If true, items will be checked to see if they or their parents are both visible and displayed
	this.properties.set(jsi.validation.Attributes.checkForViewable,
	                    jsi.validation.PropertyTypes.bool,false,true);
    
	//If true, items that cannot be seen will have their values cleared
	this.properties.set(jsi.validation.Attributes.clearIfOff,
	                    jsi.validation.PropertyTypes.bool,false,false);
    
	//If exists, values must match
	this.properties.set(jsi.validation.Attributes.compareTo,
	                    jsi.validation.PropertyTypes.string,false);
    
	//Error Text for the compareTo field
	this.properties.set(jsi.validation.Attributes.compareToText,
	                    jsi.validation.PropertyTypes.string,false);
    
	//If active, this object will be shown on false validation 
	this.properties.set(jsi.validation.Attributes.messageObject,
	                    jsi.validation.PropertyTypes,false);
    
	//If messageObject exists, this sets whether or not the showing is a DISPLAY (default) or VISIBILITY
	this.properties.set(jsi.validation.Attributes.messageShowType,
	                    jsi.validation.PropertyTypes,false,"VISIBILITY");
    
}
	
	/** METHODS **/
	jsi.validation.Validate.prototype.baseValidate = function()
	{
	    //ensure error message is cleared from last validation
		this.errMsg = "";
		
		//ignore any items not switched on
		if (this.properties.get(jsi.validation.Attributes.checkForViewable) && !this.element.canBeSeen()) 
		{
			if (this.properties.get(jsi.validation.Attributes.clearIfOff)) 
			{
				this.element.clear();
			}
			return true;
		}
		
		//ignore non required items that are empty
		if (!this.properties.get(jsi.validation.Attributes.required) && this.element.getValue() == "")
		{
		    return true;
		}
		  
		//compare to another formitem if required
		if (this.properties.get(jsi.validation.Attributes.compareTo))
		{
		    var compareTo = new jsi.dhtml.Formitem(this.properties.get(jsi.validation.Attributes.compareTo) );
		 
		     
		    if (compareTo.getValue() != this.element.getValue()) 
		    {
		        if (this.properties.get(jsi.validation.Attributes.compareToText))
		        {
		            this.errMsg = "- " + this.properties.get(jsi.validation.Attributes.compareToText) + "\n";
		        }
		        else
		        {
		            this.errMsg = "- " + this.properties.get(jsi.validation.Attributes.label) + " doesn't match." + "\n";
		        }
		    }
		}
		
	    return false;
	}
	
	jsi.validation.Validate.prototype.setMessageStatus = function(status)
	{
	    if (this.properties.get(jsi.validation.Attributes.messageObject))
	    {
	        var msgObj = new jsi.dhtml.Element(this.properties.get(jsi.validation.Attributes.messageObject));
	    
	        if (this.properties.get(jsi.validation.Attributes.messageShowType).toUpperCase() == "VISIBILITY")
	        {
	            msgObj.setVisibility(status);
	        }
	        else
	        {
	            msgObj.setDisplay(status);
	        }
	    }
	}
	
	
	/** Abstract Methods **/
	//jsi.validation.Validate.prototype.validate = function() { }



jsi.validation.ValidateText = function(type, element)
{
    //extends Validate
    jsi.validation.Validate.call(this,type,element);
    
    this.properties.set(jsi.validation.Attributes.exactChars,jsi.validation.PropertyTypes.integer,false);
    this.properties.set(jsi.validation.Attributes.minChars,jsi.validation.PropertyTypes.integer,false);
    this.properties.set(jsi.validation.Attributes.maxChars,jsi.validation.PropertyTypes.integer,false);
}

    jsi.validation.ValidateText.prototype = new jsi.validation.Validate;    
	
    jsi.validation.ValidateText.prototype.validate = function() 
	{
	    if (this.baseValidate())
		{
		    return true;
		}
		else if (this.errMsg != "")
		{
		    return false;
		}
		
		var itemValue = this.element.getValue();
		var exact,min,max, label; 
		
		label = this.properties.get(jsi.validation.Attributes.label);
		
		exact = this.properties.get(jsi.validation.Attributes.exactChars);
		min = this.properties.get(jsi.validation.Attributes.minChars);
		max = this.properties.get(jsi.validation.Attributes.maxChars);
		
		//ensure not empty
		if (itemValue == "") 
		{
			this.errMsg = "- " + label + " is required.\n";
			return false; 
		}
		
		//try an exact search if specified
		if (exact && itemValue.length != exact) 
		{
			this.errMsg = "- " + label + " must be " + exact + " characters long (currently has "+itemValue.length+").\n"; 
			return false;
		}
		
		//try a range search if specified
		if (min && max && (itemValue.length < min || max < itemValue.length)) 
		{
			this.errMsg = "- " + label + " must be between " + min + " and " + max + " characters (currently has "+itemValue.length+").\n"; 
			return false;
		}
		
		//try a min restriction if specified
		if (min && !max && (itemValue.length < min))
		{
		    this.errMsg = "- " + label + " must have at least " + min +" characters (currently has "+itemValue.length+").\n";
		    return false;
		}
		
		//try a max restriction if specified
		if (max && !min && (itemValue.length > max))
		{
		    this.errMsg = "- " + label + " cannot exceed " +max +" characters (currently has "+itemValue.length+").\n";
		    return false;
		}
		
		return true;
	}




jsi.validation.ValidateDate = function(type,element) 
{
	//extends Validate
    jsi.validation.Validate.call(this,type,element);
    
    
    this.properties.set(jsi.validation.Attributes.separator,
                        jsi.validation.PropertyTypes.string,false,"/");
    this.properties.set(jsi.validation.Attributes.onlyPast,
                        jsi.validation.PropertyTypes.bool,false,false);
    this.properties.set(jsi.validation.Attributes.onlyFuture,
                        jsi.validation.PropertyTypes.bool,false,false);
}
	
	jsi.validation.ValidateDate.prototype = new jsi.validation.Validate;    
	
	jsi.validation.ValidateDate.prototype.validate = function()
	{
		
		if (this.baseValidate())
		{
		    return true;
		}
		else if (this.errMsg != "")
		{
		    return false;
		}
		
		var itemValue = this.element.getValue();
		var separator, label; 
		
		label = this.properties.get(jsi.validation.Attributes.label);
		separator = this.properties.get(jsi.validation.Attributes.separator);
		
		
		var date_items = itemValue.split(separator);
		if (date_items.length != 3) 
		{
			this.errMsg = "- " + label + " must be in DD" + separator + "MM" + separator + "YYYY format.\n";
			return false;
		}
		else 
		{
			var day = date_items[0];
			var month = date_items[1];
			var year = date_items[2];
			
			if (isNaN(day) || day <= 0 || day > 31) 
			{
				this.errMsg = "- " + label + " must contain a valid day.\n";
				return false;
			}
			
			if (isNaN(month) || month <= 0 || month > 12)
			{
				this.errMsg = "- " + label + " must contain a valid month.\n";   
				return false;
			}
			
			//NOTE: the year limits here are hard coded to 1800-2200. These could be calculated dynamically (though that will depend on the user's computer time)
			if (isNaN(year) || year <= 1800 || year >= 2200) 
			{
				this.errMsg = "- " + label + " must contain a valid year.\n";
				return false;
			}  
			
			if (this.properties.get(jsi.validation.Attributes.onlyPast)) 
			{
				var myDate = new Date();
				myDate.setFullYear(year,(month-1),day);
				
				var today = new Date();
				if (myDate >= today) 
				{	
					this.errMsg = "- " + label + " must contain a valid date in the past.\n";
					return false;	
				}
			
			}
			
			if (this.properties.get(jsi.validation.Attributes.onlyFuture)) 
			{
				var myDate = new Date();
				myDate.setFullYear(year,(month-1),day);
				
				var today = new Date();
				if (myDate <= today) 
				{	
					this.errMsg = "- " + label + " must contain a valid date in the future.\n";
					return false;	
				}
			
			}
			
		}
		
		return true;
	
	}



jsi.validation.ValidateEmail = function(type,element) 
{
	//extends Validate
    jsi.validation.Validate.call(this,type,element);
    
}

    jsi.validation.ValidateEmail.prototype = new jsi.validation.Validate;
    
    
    jsi.validation.ValidateEmail.prototype.validate = function()
	{
		if (this.baseValidate())
		{
		    return true;
		}
		else if (this.errMsg != "")
		{
		    return false;
		}
		
		var itemValue = this.element.getValue();
		
		var at = itemValue.indexOf("@");
		
		
		
		if (itemValue.search(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]{2,})+$/i) == -1) 
		{
			this.errMsg = "- " + this.properties.get(jsi.validation.Attributes.label) + " must contain an e-mail address.\n";
			return false;
		}
		
		return true;
	}


jsi.validation.ValidateNumber = function(type,element) 
{
	//extends Validate
    jsi.validation.Validate.call(this,type,element);
    
    this.properties.set(jsi.validation.Attributes.exactChars,
                        jsi.validation.PropertyTypes.integer,false);
    this.properties.set(jsi.validation.Attributes.minValue,
                        jsi.validation.PropertyTypes.integer,false);
    this.properties.set(jsi.validation.Attributes.maxValue,
                        jsi.validation.PropertyTypes.integer,false);
    
}
	
	jsi.validation.ValidateNumber.prototype = new jsi.validation.Validate;
	
	
	jsi.validation.ValidateNumber.prototype.validate = function() 
	{
		if (this.baseValidate())
		{
		    return true;
		}
		else if (this.errMsg != "")
		{
		    return false;
		}
		
		var itemValue = this.element.getValue();
		var exact, min, max, label; 
		
		
		//load these variables now
		label = this.properties.get(jsi.validation.Attributes.label);
		
		exact = this.properties.get(jsi.validation.Attributes.exactChars);
		min = this.properties.get(jsi.validation.Attributes.minValue);
		max = this.properties.get(jsi.validation.Attributes.maxValue);
		
		//ensure something entered
		if (itemValue == "") 
		{
			this.errMsg = "- " + label + " is required.\n"; 
			return false;
		}
		
		//ensure number
		if (isNaN(itemValue)) 
		{
			this.errMsg = "- " + label + " must contain a number.\n"; 
			return false;
		}
		
		//try an exact search if specified
		if (exact != null && itemValue.length != exact) 
		{
			this.errMsg = "- " + label + " must be " + exact + " digits long.\n"; 
			return false;
		}
		
		//try a range search if specified
		if (min != null && max != null && (itemValue < min || max < itemValue)) 
		{
			this.errMsg = "- " + label + " must contain a number between " + min + " and " + max + ".\n"; 
			return false;
		}
		
		//try a min restriction if specified
		if (min != null && max == null && (itemValue < min))
		{
		    this.errMsg = "- " + label + " must be at least " + min +".\n";
		    return false;
		}
		
		//try a max restriction if specified
		if (max != null && min == null && (itemValue > max))
		{
		    this.errMsg = "- " + label + " cannot exceed " + max +".\n";
		    return false;
		}
		
		return true;
	}


//Element == CheckItem
jsi.validation.ValidateSingle = function(type,element) 
{
    //extends Validate
    jsi.validation.Validate.call(this,type,element);
}

    jsi.validation.ValidateSingle.prototype = new jsi.validation.Validate; 
    
    jsi.validation.ValidateSingle.prototype.validate = function() 
	{
		if (this.baseValidate())
		{
		    return true;
		}
		else if (this.errMsg != "")
		{
		    return false;
		}
		
        if (!this.element.getChecked()) 
		{
			this.errMsg = "- You must " + this.properties.get(jsi.validation.Attributes.label) + " to continue.\n";
			
			return false;
		}
		
		return true;
	}	  



//Element == ElementCollection_Radio
jsi.validation.ValidateRadios = function(type,element) 
{
	//extends Validate
    jsi.validation.Validate.call(this,type,element);
    
    //cover a false call via the prototype setting inheritance
    if (this.element == null)
    {
        return;
    }
    
    if (!this.element.children)
    {
        throw("Validation.RadioCollection(): the element provided must be an instance of ElementCollection_Radio.");
    }
    
    this.group = this.element.getProperty("name", false, null);

}

    jsi.validation.ValidateRadios.prototype = new jsi.validation.Validate;
        
    jsi.validation.ValidateRadios.prototype.addToGroup = function(child)
    {
        this.element.addChild(child);
    }
    
	jsi.validation.ValidateRadios.prototype.validate = function() 
	{
		if (this.baseValidate())
		{
		    return true;
		}
		else if (this.errMsg != "")
		{
		    return false;
		}
		
		var found = this.element.getSelected();
        
        if (!found) 
		{   
			this.errMsg = "- An option must be chosen for " + this.properties.get(jsi.validation.Attributes.label) + ".\n";   
			
			return false;
		}
		
		return true;
	}	  



jsi.validation.ValidateCheckboxes = new function(type,element) 
{
	//extends Validate
    jsi.validation.ValidateRadios.call(this,type,element);
    
	this.properties.set(jsi.validation.Attributes.exactChosen,
	                    jsi.validation.PropertyTypes.integer,false);
    this.properties.set(jsi.validation.Attributes.minChosen,
                        jsi.validation.PropertyTypes.integer,false);
    this.properties.set(jsi.validation.Attributes.maxChosen,
                        jsi.validation.PropertyTypes.integer,false);

}

    jsi.validation.ValidateCheckboxes.prototype = new jsi.validation.Validate;    
	

	jsi.validation.ValidateCheckboxes.prototype.validate = function() 
	{
		if (this.baseValidate())
		{
		    return true;
		}
		else if (this.errMsg != "")
		{
		    return false;
		}
		
		
		var exact, min, max, label; 
		
		//load these variables now
		label = this.properties.get(jsi.validation.Attributes.label);
		
		exact = this.properties.get(jsi.validation.Attributes.exactChosen);
		min = this.properties.get(jsi.validation.Attributes.minChosen);
		max = this.properties.get(jsi.validation.Attributes.maxChosen);
		
        var found = this.element.getSelected();
        
        if (min && found.length < min)
		{
		    var plural = "s";
		    if (min == 1)
		    {
		        plural = "";
		    }
		    this.errMsg = "- A minimum of " + min + " item"+plural + " must be chosen for " + label + ".\n";
		    return false;
		}
		else if (max && found.length > max)
		{
		    var plural = "s";
		    if (max == 1)
		    {
		        plural = "";
		    }
		    this.errMsg = "- A maximum of " + max + " item"+plural + " can be chosen for " + label + ".\n";
		    return false;
		}
		else if (exact && found.length != exact)
		{
		    var plural = "s";
		    if (exact == 1)
		    {
		        plural = "";
		    }

		    this.errMsg = "- Only " + exact + " item" + plural + " can be chosen for " + label + ".\n";
		    return false;
		}
		else if (found.length < 1) 
		{
		    
			this.errMsg = "- An option must be chosen for " + label + ".\n";   
			
			return false;
		}
		
		
		return true;
	}	  