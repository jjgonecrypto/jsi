/** Major package handler for JavaScriptInterface.
 * 
 * @project jsi:javascript.interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 * 
 */

// Control object
var jsi = { };

jsi.debug = false; 

jsi.baseLocation = null;
             

jsi._temp_ = {};
      
//get the location
jsi._temp_.scriptTags = document.getElementsByTagName("script");
    
for (var i = 0; i < jsi._temp_.scriptTags.length; i++)
{
    if (!jsi._temp_.scriptTags[i].getAttribute) 
    {
        continue;
    }
    
    jsi._temp_.src = jsi._temp_.scriptTags[i].getAttribute("src");
    
    if (!jsi._temp_.src)
    {
        continue;
    }
    
    if (jsi._temp_.src.indexOf("jsi") >= 0)
    {
        jsi._temp_.pathArr = jsi._temp_.src.split("/");
        jsi._temp_.pathArr.pop();
        jsi.baseLocation = jsi._temp_.pathArr.join("/");
        break;
    }
}
    
    
jsi.handleError = function(msg, url, line)
{
    if (jsi.debug)
    {
        alert("URL: " + url + "\n Line: " + line + "\n Message: " + msg);
    }
    
    //set to false to hide errors from output
    return false;
}

//Log errors
onerror = jsi.handleError;

//Event pre and post functions
jsi.Event = function()
{
    this.startupFunctions = new Array();
    
    this.completeFunctions = new Array();
}   
    
    jsi.Event.prototype.addStartupFunction = function(inFnc)
    {
        this.startupFunctions[this.startupFunctions.length] = inFnc;
        return true;
    }
    
    jsi.Event.prototype.addCompleteFunction = function(inFnc)
    {
        this.completeFunctions[this.completeFunctions.length] = inFnc;
        return true;
    }
    
    
    jsi.Event.prototype.executeStartupFunctions = function()
    {
        for (var i in this.startupFunctions)
        {
            this.startupFunctions[i].call(this);
        }
    }
    
    jsi.Event.prototype.executeCompleteFunctions = function()
    {
        for (var i in this.completeFunctions)
        {
            this.completeFunctions[i].call(this);
        }
    }

jsi.onload = new jsi.Event();

jsi.onsubmit = new jsi.Event();


//class: File
jsi.File = function(path,filename)
{   
    this.path = path;
    
    this.filename = filename;
}

    jsi.File.prototype.include = function()
    {
         //this elegant solution doesn't work properly on IE6
         //IE6 runs it asynchronisly.
           
           /*
                var html_doc = document.getElementsByTagName('head').item(0);
                var js = document.createElement('script');
                js.setAttribute('language', 'javascript');
                js.setAttribute('type', 'text\/javascript');
                js.setAttribute('src', this.path+this.filename);
                html_doc.appendChild(js);
                return true;
           */    
           document.write("<script type='text\/javascript' src='"+this.path+this.filename+"'><\/script>");
    }
  
//class: Package
jsi.Package = function(name, dependencies)
{
    this.name = name;
    
    this.Files = new Array();
        
    this.dependencies = new Array();
    
    for (var i = 1; i < arguments.length; i++)
    {
        this.dependencies[i] = arguments[i];
    }
    
    this.isLoaded = false; 

}
    
    jsi.Package.prototype.addFile = function(path, file)
    {
        var fullpath = (jsi.baseLocation != null && jsi.baseLocation != "") ? jsi.baseLocation+"/"+path : path;
        
        this.Files[this.Files.length] = new jsi.File(fullpath,file);
    }
    
    jsi.Package.prototype.load = function()
    {
        if (this.isLoaded)
        {
            return;
        }
        
        for (var i in this.dependencies)
        {
            if (!this.dependencies[i].isLoaded)
            {
                this.dependencies[i].load();
            }
        }
        
        
        for (var i in this.Files)
        {
            this.Files[i].include();   
        }
        
        this.isLoaded = true;
    }

    jsi.Package.prototype.checkLoaded = function()
    {
        if (!this.isLoaded)
        {
            throw("Package: " + this.name + " not loaded. Please load it separately in the header after the first include file.");
        }
    }
    
    

//Library package object
jsi.library = new jsi.Package("library")
{
}
    //add control file
    jsi.library.addFile("library/","jsi_library.js");

    //autoload the library - NOTE: it cannot be used in this script file
    jsi.library.load();


//DHTML package
jsi.dhtml = new jsi.Package("dhtml")
{
    //This is called BEFORE the parent constructor!!
}

    //add control file
    jsi.dhtml.addFile("packages/dhtml/","jsi_dhtml.js");
    
    // Methods
    
    /**
     * @depreciated
     */
    jsi.dhtml.loadElement = function(idOrElement)
    {
        this.checkLoaded();
        
        return new jsi.dhtml.Element(idOrElement);
    }
    
    jsi.dhtml.resetElement = function(element)
    {
        this.checkLoaded();
         
        element.loadObject();
        
        var nodeName = element.getTagName();
        
        //NOTE: don't use this.isFormInput() here otherwise infinite loop
        if (jsi.library.isNodeFormInput(nodeName))
        {
            //is a formItem - so reset the DOM object and reset this object type
            if (element.isCheckitemInput())
            {    
                element = new jsi.dhtml.Checkitem(element.idOrElement);
            }
            else if (nodeName == "option")
            {
                element = new jsi.dhtml.Selectoption(element.idOrElement);
            }
            else if (nodeName == "select")
            {
                element = new jsi.dhtml.Selectbox(element.idOrElement);
            }
            else
            {
                element = new jsi.dhtml.Formitem(element.idOrElement);
            }
            
            element.loadObject();
        }
        
        return element;
    
    }
    
    /** Load an element from the DOM.
     * @param DOMElement
     */     
    jsi.dhtml.Factory = function(node)
    {
        tag = node.nodeName.toLowerCase();
        
        var loaded;
        
        if (tag == "input" || tag == "textarea")
        {
            var type = node.getAttribute("type")
            
            if (type == "radio" || type == "checkbox")
            {
                loaded = new jsi.dhtml.Checkitem(node);
            }
            else
            {
                loaded = new jsi.dhtml.Formitem(node); 
            }
        }
        else if (tag == "select")
        {
            loaded = new jsi.dhtml.Selectbox(node);
        }
        else if (tag == "option")
        {
            loaded = new jsi.dhtml.Selectoption(node);
        }
        else 
        {
            loaded = new jsi.dhtml.Element(node);
        }
        
        return loaded;
    }
    
    /** NOTE: tag may be "radio" or "checkbox"
     */
    jsi.dhtml.createElement = function(tag, id)
    {
        this.checkLoaded();

        tag = tag.toLowerCase();
        
        var node;
        
        if (tag == "radio" || tag == "checkbox")
        {
            node = document.createElement("input");
            node.setAttribute("type",tag);
        }
        else
        {
            node = document.createElement(tag);
        }

        if (id)
        {
            node.setAttribute("id",id);
        }
        
        return jsi.dhtml.Factory(node);
        
    }
    
    jsi.dhtml.createNamedElement = function(tag, attributes)
    {
        this.checkLoaded();
        
        var node = document.createNamedElement(tag, attributes);
        
        return jsi.dhtml.Factory(node);
    }
    
    jsi.dhtml.createTextNode = function(text)
    {
        this.checkLoaded();

        var node = document.createTextNode(text);
        
        return new jsi.dhtml.Element(node);
        
    }
    
//Animation package
jsi.animation = new jsi.Package("animation")
{
    //This is called BEFORE the parent constructor!!
}

    //add control file
    jsi.animation.addFile("packages/animation/","jsi_animation.js");
    

//AJAX package
jsi.ajax = new jsi.Package("ajax",jsi.dhtml)
{
    //This is called BEFORE the parent constructor!!
}

    //add control file
    jsi.ajax.addFile("packages/ajax/","jsi_ajax.js");

//Caendar package
jsi.calendar = new jsi.Package("calendar",jsi.dhtml)
{}    

    jsi.calendar.addFile("packages/calendar/","jsi_calendar.js");


//Validation package
jsi.validation = new jsi.Package("validation",jsi.dhtml)
{
    //This is called BEFORE the parent constructor!!
}

    jsi.validation.addFile("packages/validation/","jsi_validation.js");
    

    jsi.validation.validators = new Array();

    jsi.validation.autoValidate = true; 
    
    //an array of buttons (or a single one) ids not to cause validation on submit     
    jsi.validation.aspdotnetNoValidateButtons = null; 
    
    jsi.validation.validationOverride = false;
    
    jsi.validation.isDotNet = false; 
    
    jsi.validation.currentlySubmittingButton = null;
    
    
    //@param string type = [numeric | single | radio | checkbox | text | email | date]
    //@param Element element
    jsi.validation.Factory = function(type, element)
    {
        switch (type)
        {
            case "numeric":
                return new jsi.validation.ValidateNumber(type,element);
            case "single":
                return new jsi.validation.ValidateSingle(type,element);
            case "radio":
                return new jsi.validation.ValidateRadios(type,element);
            case "checkbox":
                return new jsi.validation.ValidateCheckboxes(type,element);
            case "date":
               return new jsi.validation.ValidateDate(type,element);
            case "email":
                return new jsi.validation.ValidateEmail(type,element);  
            default:
                return new jsi.validation.ValidateText(type,element);
        }
    }

    //protected function
    jsi.validation.appendValidator = function(validator)
    {
        this.checkLoaded();
        
        this.validators[this.validators.length] = validator;
    }
    
    
    
    jsi.validation.getValidationFromId = function(id)
    {
        this.checkLoaded();

        for (var i in this.validators)
        {
            if (this.validators[i].element.id == id)
            {
                return this.validators[i];
            }
        }
    }
    
    
    jsi.validation.attachValidationEvent = function(validator)
	{
	
	    var handler = function(event) { 
	    
	        
	        //allow buttons that are non-submitting to pass through
	        if (jsi.validation.currentlySubmittingButton && jsi.validation.isObjectNotToValidate(jsi.validation.currentlySubmittingButton))
	        {
	            return true;
	        }
	        
	        jsi.onsubmit.executeStartupFunctions();
        
	        var target = jsi.library.getTargetFromEvent(event); 
	                
	        //check for target - ASP.NET postbacks will not register target, so take the asp form
	        if (!target) { target = document.forms['aspnetForm']; }  	        
	        if (!target) { target = document.aspnetForm; }
	        
	        var val = jsi.validation.getValidationFromId(target.id); 
	        var status = val.validate(); 
	        
	        if (status == true)
	        {
	            jsi.onsubmit.executeCompleteFunctions();
	        }
	        return status;
	    
	    } 
	 
	    if (validator.properties.get(jsi.validation.Attributes.validateOn) == "submit")
	    {
	        validator.element.addSubmitEvent(handler);
	    }
	     
	}
    
    //handle manual submits from both BUTTONs and INPUT buttons
    jsi.validation.doSubmit = function(formId)
    {
        this.checkLoaded();

        jsi.onsubmit.executeStartupFunctions();
        
        var val = jsi.validation.getValidationFromId(formId);
        
        
        if (val.validate())
        {
            jsi.onsubmit.executeCompleteFunctions();
        
            val.element.submit();
            return true;
        }
        else
        {
            return false;
        }
    }
    
    //ensures the form on an ASP.NET page is set to validate
    jsi.validation.initialiseASPDOTNETValidation = function(buttonsToExclude)
    {
        this.checkLoaded();

        this.isDotNet = true;
        
        if (buttonsToExclude)
        {
        
            if ((typeof(buttonsToExclude)).toString().toLowerCase() == "string")
            {
                this.aspdotnetNoValidateButtons = new Array(buttonsToExclude);
            }
            else
            {
                this.aspdotnetNoValidateButtons = buttonsToExclude;
            }
        }
        
        jsi.onload.addStartupFunction(function() { document.forms[0].setAttribute("jsi_validate","true");  });
    
    
        jsi.onload.addCompleteFunction(function() 
        {
               
            //override the ASP.NET postback function to keep the event target    
            __doPostBack = function(eventTarget, eventArgument)
            {
                jsi.validation.currentlySubmittingButton = eventTarget;
                
                if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
                    theForm.__EVENTTARGET.value = eventTarget;
                    theForm.__EVENTARGUMENT.value = eventArgument;
                    theForm.submit();
                }
            }
            
        }   
        );
    }
    
    jsi.validation.isObjectNotToValidate = function(id)
    {
        return jsi.library.searchArrayForReverseContains(id,this.aspdotnetNoValidateButtons)
    }
    
    
//Alteration package
jsi.alteration = new jsi.Package("alteration",jsi.dhtml)
{
    //This is called BEFORE the parent constructor!!
}

    jsi.alteration.addFile("packages/alteration/","jsi_alteration.js");
    
    
//Table package
jsi.table = new jsi.Package("table",jsi.dhtml)
{
    //This is called BEFORE the parent constructor!!
}
    jsi.table.addFile("packages/table/","jsi_table.js");

    jsi.table._tableIndex = 0;
    
    jsi.table._tables = new Array();
    
    //called from within the table package - and is protected
    jsi.table.appendTable = function(table)
    {
        table.id = this._tableIndex;
        
        this._tables[this._tableIndex++] = table;
    }
    
    jsi.table.getTable = function(id)
    {
        return this._tables[id];
    }
    
    /*
    this.createTable = function(parentElement, xmlDoc)
    {
        table = new _jsi_TABLE_Table(_tableIndex, parentElement);
        
        if (xmlDoc != null)
        {
            table.loadFromXML(xmlDoc);
        }
        
        _tables[_tableIndex++] = table;
        
        return table;
    }
    
    this.createInputTable = function(parentElement,preloadElement,outputElement,heading)
    {
        //ensure the elements are loaded as the correct type (element or formitem)
        
        table = new _jsi_TABLE_Table_Input(_tableIndex, parentElement,preloadElement,outputElement,heading);
        
        _tables[_tableIndex++] = table;
        
        return table;
    }
    */
    
    jsi.table.sortTable = function(tableid, sortColumn)
    {
        this._tables[tableid].sortRowsBy(sortColumn);
        
        var renderer = this._tables[tableid].getRenderer();
       
        //reset the current page
        renderer.setStart(0);
        
        renderer.draw();
    }
    
    jsi.table.goPaging = function(tableid, start)
    {
        var renderer = this._tables[tableid].getRenderer();
       
        //reset the current page
        renderer.setStart(start);
        
        renderer.draw();
    }



//TEST package
jsi.test = new jsi.Package("test",jsi.dhtml)
{}

    //add control file
    jsi.test.addFile("packages/test/","jsi_test.js");


//Flash package
jsi.flash = new jsi.Package("flash",jsi.dhtml)
{}

    //add control file
    jsi.test.addFile("packages/flash/","jsi_flash.js");
    
        

//ASP.NET package
jsi.aspdotnet = new jsi.Package("aspdotnet") 
{}
    
    jsi.aspdotnet.addFile("packages/aspdotnet/","jsi_aspdotnet.js");
    
    //flag to allow execution of onLoad() function for each child
    jsi.aspdotnet.doOnLoads = true;
    
    jsi.aspdotnet.ctrlInstances = new Array();

    jsi.aspdotnet.addControlInstance = function(control)
    {
        this.ctrlInstances[control.id] = control;

        return control;
    }

    jsi.aspdotnet.getControlInstance = function(ctrlID)
    {
        return this.ctrlInstances[ctrlID];
    }

    
    
    

//JSI initialise all loaded packages
jsi.init = function()
{

    //call any function for each assigned onloader
    jsi.onload.executeStartupFunctions();
    
    
    //Validation Startup
    if (jsi.validation.isLoaded && jsi.validation.autoValidate)
    {
        var validateAttribute = "jsi_validate";
        
        formNodes = document.getElementsByTagName("form");
        
        var inputNodes = document.getElementsByTagName("input");
        var textareaNodes = document.getElementsByTagName("textarea");
        var selectNodes = document.getElementsByTagName("select");
        
        //append all input fields into one array
        var inputArray = new Array(); 
        
        for (var j = 0; j < inputNodes.length; j++)
        {
            inputArray[inputArray.length] = inputNodes.item(j);
        }
        for (var j = 0; j < textareaNodes.length; j++)
        {
            inputArray[inputArray.length] = textareaNodes.item(j);
        }
        for (var j = 0; j < selectNodes.length; j++)
        {
            inputArray[inputArray.length] = selectNodes.item(j);
        }
        
        
      
        //append all 
        for (var i = 0; i < formNodes.length; i++)
        {
            var newForm = formNodes.item(i);
         
          
            //bypass this form if not specified as a validate enabled form
            if (!newForm.getAttribute(validateAttribute) || newForm.getAttribute(validateAttribute).toLowerCase() != "true") 
            {
                continue;
            }
           
            
            var formElement = new jsi.dhtml.Form(newForm);
            
            //create a new validation object
            var formValidator = new jsi.validation.Validation(formElement);
         
            //attach event to this formobj
            jsi.validation.attachValidationEvent(formValidator);
         
            for (var x in inputArray)
            {
                //handle ASP.NET submits that should not cause validation
                if (inputArray[x].form && inputArray[x].form.id == newForm.id && jsi.validation.isDotNet && (inputArray[x].getAttribute("type") == "submit" || inputArray[x].getAttribute("type") == "image") && jsi.validation.isObjectNotToValidate(inputArray[x].id))
                {
                
                    inputArray[x].onclick = function() 
                    { 
                        jsi.validation.currentlySubmittingButton = this.id;
                    };
                    
                    continue;
                } 
                  
                //ensure this input belongs to the form
                if (inputArray[x].form && inputArray[x].form.id == newForm.id && inputArray[x].getAttribute(validateAttribute) != null && inputArray[x].getAttribute(validateAttribute).toLowerCase() == "true")
                {
                    var newInput;
                    
                    var name = inputArray[x].getAttribute("name");
                    
                    var valType = inputArray[x].getAttribute(jsi.validation.Attributes.type);
                    
                    if (!valType)
                    {
                        throw("Validation.OnLoad(): Input with id='"+inputArray[x].id+"' must have attribute validation type.");
                    }
                    else
                    {
                        valType = valType.toLowerCase();
                    }
                    
                    //if this element has a group id, then it should be grouped accordingly
                    if (name && (valType == "radio" || valType == "checkbox")) 
                    {
                        var foundValidator = formValidator.findGroup(name); 
                        
                        if (foundValidator)
                        {
                            //append this to it 
                            foundValidator.addToGroup(new jsi.dhtml.Checkitem(inputArray[x]));
                        }
                        else
                        {
                            //create a new validator
                            
                            var newCollection;
                            
                            if (valType == "radio")
                            {
                                //load new empty collection
                                newCollection = new jsi.dhtml.RadioCollection();
                                newCollection.addChild(new jsi.dhtml.Checkitem(inputArray[x])); 
                            }
                            else
                            {
                                //load new empty collection
                                newCollection = new jsi.dhtml.CheckboxCollection();
                                newCollection.addChild(new jsi.dhtml.Checkitem(inputArray[x]));
                            }
                             
                            formValidator.addChild(jsi.validation.Factory(valType, newCollection));
                        }
                              
                        //move on to the next input item
                        continue;
                    }
                    
                    //Otherwise, determine which input this item is
                    switch (inputArray[x].type)
                    {
                        case "radio":
                            newInput = new jsi.dhtml.Checkitem(inputArray[x]);
                            break;
                        case "checkbox":
                            newInput = new jsi.dhtml.Checkitem(inputArray[x]);
                            break;
                        case "select-one":
                            newInput = new jsi.dhtml.Selectbox(inputArray[x]);
                            break;
                        case "select-multiple":
                            newInput = new jsi.dhtml.Selectbox(inputArray[x]);
                            break;
                        default:
                            newInput = new jsi.dhtml.Formitem(inputArray[x]);
                    }
                    
                    var newFormInput = jsi.validation.Factory(valType, newInput);
                 
                    formValidator.addChild(newFormInput);
                      
                }
            }
            
            
             
            
        }

    }
    
    
    //if DHTML
    
    
    //if ASP.NET
    if (jsi.aspdotnet.isLoaded && jsi.aspdotnet.doOnLoads)
    {
    
        //go through each control instance, calling any onLoad functions
        for (var i in jsi.aspdotnet.ctrlInstances)
        {
            if (jsi.aspdotnet.ctrlInstances[i].onLoad != null 
                && typeof(jsi.aspdotnet.ctrlInstances[i].onLoad) == "function")
            {
                jsi.aspdotnet.ctrlInstances[i].onLoad.call(jsi.aspdotnet.ctrlInstances[i]);
            }
        }
    
    }
    
    
    
    
    jsi.onload.executeCompleteFunctions();
    
}

window.onload=jsi.init;




