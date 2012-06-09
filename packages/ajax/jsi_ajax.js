/** Lightweight AJAX package. 
 *
 * @project jsi javascript:interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 *
 * @package ajax
 * @dependencies dhtml table
 */


/** An ajax instance - allowing base access to Ajax
 * @class AjaxInstance
 */
jsi.ajax.Instance = function()
{
    this._XMLHttp = null;

    //load an ajax instance
    if (window.ActiveXObject)
    {
      try
      {
         this._XMLHttp = new ActiveXObject("Msxml2.XMLHTTP");
      }
      catch(e)
      {
         this._XMLHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
    }
    else if (window.XMLHttpRequest)
    {
        this._XMLHttp = new XMLHttpRequest();
    }
}

    jsi.ajax.Instance.prototype.isSupported = function()
    {
      return this._XMLHttp != null;
    }

    jsi.ajax.Instance.prototype.getResponse = function()
    {
        if (this._XMLHttp == null)
        {
            throw("Browser doesn't support ajax.");
        }

        return this._XMLHttp.responseText;
    }
    
    jsi.ajax.Instance.prototype.getXMLResponse = function()
    {
        if (this._XMLHttp == null)
        {
            throw("Browser doesn't support ajax.");
        }

        return this._XMLHttp.responseXML;
    }

    jsi.ajax.Instance.prototype.send = function(url, catchFunction, isXml)
    {

        if (this._XMLHttp == null)
        {
            throw("Browser doesn't support ajax.");
        }
        
        var urlkey = (url.indexOf("?") > -1) ? "&" : "?";

        //prevent browser cache
        url += urlkey + "__usx="+Math.random();

        if (!isXml && window.XMLHttpRequest)
        {
            //prevent firefox error if not well formed xml
            this._XMLHttp.overrideMimeType('text/html');
        }
      
        
        this._XMLHttp.open("GET",url,true);
        
        this._XMLHttp.onreadystatechange = catchFunction;

        this._XMLHttp.send(null);
        
        
    }

    jsi.ajax.Instance.prototype.isReady = function()
    {
        state = (this._XMLHttp.readyState == 4 || this._XMLHttp.readyState == "complete");
        
        if (state)
        {
            if (this._XMLHttp.status == 200)
            {
                return true;
            }
            else
            {
                throw("Ajax returned an invalid status of " + this._XMLHttp.status);
            }
        }
        
        return state;
    }
    



/** An AjaxElement
 * @class AjaxElement
 */
jsi.ajax.Element = function(label, element)
{
    this.label = label;
    
    //@var DHTML.Element or string (for input only)
    this.element = element;
}

    jsi.ajax.Element.prototype.getValue = function()
    {
        if (typeof(this.element) == "string")
        {
            return this.element;
        }
        else
        {
            return this.element.getValue();
        }
    }



/** Automate the ajax process, with single row ajax output.
 * @class AjaxAutomate
 */
jsi.ajax.Automate = function(inputParams, outputParams, baseUrl, doXML)
{
    //@var Array [AjaxElement]
    this.input = inputParams;
    
    //@var Array [AjaxElement]
    this.output = outputParams;
    
    this.url = (baseUrl != null) ? baseUrl : window.location.href;
    
    this.doXML = doXML;
    
    //private ajax instance
    this.ajax = new jsi.ajax.Instance(); 
    
    var self = this;
    
    //functions to call before start response
    this.startupFunctions = new Array();
    
    //functions to call after response
    this.completeFunctions = new Array();
    
    //optional function to call with the every row of output
    this.outputFunction = null;
      
    //keep this function within this class to allow access to self
    this.callback = function()
    {
        if (self.ajax.isReady())
        {
            //simply get all outputs for a single row
            if (self.doXML)
            {
                var xmldoc = self.ajax.getXMLResponse();
				
				var root = xmldoc.documentElement;
				
				var rowNodes = root.getElementsByTagName("row");
				
				

				for (var x = 0; x < rowNodes.length; x++)
				{
				    //get current row
				    var row = rowNodes[x];
				
				    var rowArray = new Array();
				    
				    for (var i in self.output)
				    {
				        var item = self.output[i];
    				    
				        var node = row.getElementsByTagName(item.label).item(0);
    				    
				       
				        if (node != null)
				        {
				            if (self.outputFunction != null)
				            {
				                //compile the output as an array
				                rowArray[item.label] = node.firstChild.data;
 				            }
				            else
				            {
				                self.output[i].element.setValue(node.firstChild.data);
				            }
				        }
				        
				        
				    }
				    
				    //if output function exists
				    if (self.outputFunction != null)
			        {
			            //call the output function with data
			            self.outputFunction.call(self,rowArray);
			        }
				    
				}
            }
            else
            {
                //is plain text response, so just response enter into the first output
                var data = self.ajax.getResponse();
				
				self.output[0].element.setValue(data);
            }
        
            for (var j in self.completeFunctions)
            {
                fnc = self.completeFunctions[j];
                fnc.call(self);
            }
        }
    }

}    
    
    jsi.ajax.Automate.prototype.start = function()
    {
        
        //append to the url
        tmp_url = this.url;
     	    						
	    if (tmp_url.indexOf("?") > -1)
	    {
		    prefix = "&";
	    }
	    else
	    {
		    prefix = "?";
	    }
    	
    	tmp_url += prefix;
   
    	var vals = new Array();
    	
    	for (var i in this.input)
    	{
    	    var item = this.input[i];
    	    vals.push(item.label + "=" + item.getValue());
    	}
    	
    	tmp_url += vals.join("&");
	    
	    
	    //call startup functions
	    for (var j in this.startupFunctions)
        {
            fnc = this.startupFunctions[j];
            fnc.call(this);
        }
    	
	    this.ajax.send(tmp_url,this.callback,this.doXML);
        
    }
    
    
    jsi.ajax.Automate.prototype.addCompleteFunction = function(fnc)
    {
        this.completeFunctions.push(fnc);    
    }
    
    jsi.ajax.Automate.prototype.addStartupFunction = function(fnc)
    {
        this.startupFunctions.push(fnc);    
    }

 

/** Another ajax automated class, this time a table to be built via AJAX.
 * 
 */
jsi.ajax.AutomateTable = function(table, inputArray)
{

    if (!jsi.table.isLoaded)
    {
        throw("Fatal error: Cannot use AjaxTable without first loading table package.");
    }
    
    //extend the Automate object
    jsi.ajax.Automate.call(this, inputArray, new Array(), null, true);
    
    
    this.table = table;

    var self = this;
    
    this.callback = function()
    {
        if (self.ajax.isReady())
        {
            var xmldoc = self.ajax.getXMLResponse();
			
			self.table.loadFromXML(new jsi.dhtml.Element(xmldoc));
        
            for (var j in self.completeFunctions)
            {
                fnc = self.completeFunctions[j];
                fnc.call(self);
            }
        }
    }
    
}

jsi.ajax.AutomateTable.prototype = new jsi.ajax.Automate;