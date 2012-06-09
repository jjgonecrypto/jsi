/** Local and third party functionality. 
 * 
 * Please note, copyright for third party functionality resides with 
 * the authors.
 * 
 * @project jsi:javascript.interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 *
 * @package library
 */


//Found on http://www.easy-reader.net/archives/2005/09/02/death-to-bad-dom-implementations/
document.createNamedElement = function(type, attributes) 
{
  var element;
  var att_string = "";
  
  for (var i in attributes)
  {
    att_string += " " + attributes[i].name + "=\"" + attributes[i].value + "\" ";  
  }
  
  try 
  {
    element = document.createElement('<'+type+att_string+'>');
  } 
  catch (e) { }
  
  if (!element || !element.name) 
  {
    // Not in IE, then
    element = document.createElement(type)
    
    for (var i in attributes)
    {
        element.setAttribute(attributes[i].name, attributes[i].value);
    }
  }
  
  return element;
}


jsi.library.isNodeFormInput = function(nodeName)
{
    return  nodeName.toLowerCase() == "input" || 
            nodeName.toLowerCase() == "select" || 
            nodeName.toLowerCase() == "option" ||
            nodeName.toLowerCase() == "textarea"; 
}

//retrieves a parent with a certain name
jsi.library.getParentByTagName = function(startNode, parentTag)
{
    if (!startNode)
    {
        return null;
    }
     
    if (startNode.nodeName.toLowerCase() == parentTag.toLowerCase())
    {
        return startNode;
    }
    else
    {
        return jsi.library.getParentByTagName(startNode.parentNode, parentTag);
    }
    
}

// Returns the target element from an event
jsi.library.getTargetFromEvent = function(event)
{
    var targ; 
    if (!event) 
    {
        var event = window.event;
    }
    
    
    if (!event)
    {
        //ASP.NET postbacks will come here
        return null;
    }
    
    if (event.target) 
    {
        targ = event.target;
    }                                        
    else if (event.srcElement) 
    {
        targ = event.srcElement;
    }
    //Safari bug fix
    if (targ.nodeType == 3) 
    {
        targ = targ.parentNode; 
        //alert(targ.id);
        var x = targ.id;
    }
    return targ;
}

//Returns true if string is "true", false if "false", null otherwise
jsi.library.parseBoolean = function(someString)
{

    if (typeof(someString) == "boolean")
    {
        return someString;
    }
    
    if (typeof(someString) != "string")
    {
        return null;
    }
    
    
    if (someString.toLowerCase() == "true")
    {
        return true;
    }
    else if (someString.toLowerCase() == "false")
    {
        return false;
    }
    else
    {
        return null;
    }   
}

 //////////////////////////////////////////////
// Generic Array search - for unsorted arrays //
 //////////////////////////////////////////////

jsi.library.searchArray = function(needle, haystack)
{
    for (var i in haystack)
    {
        if (haystack[i] == needle)
        {
            return true;
        }
    }
    return false;
} 

jsi.library.searchArrayForReverseContains = function(needle, haystack)
{
    for (var i in haystack)
    {
        if (haystack[i] == needle || needle.indexOf(haystack[i]) >= 0)
        {
            return true;
        }
    }
    return false;
}

//////////////////////////////
// Generic Decimal Rounder ///
/////////////////////////////

jsi.library.roundDecimal = function(value, places)
{
	var output;
	var ten = 10;
	var factor = Math.pow(ten,places);
	
	if (places)
	{
		output = Math.round(value*factor);
		output = output / (factor);
	}
	else
	{
		output = Math.round(value);
	}
	
	return output;
}

//////////////////////////////
// Third Party Functionality //
//////////////////////////////

//// TIMER() class -> allows Object Orientated setTimeout calls

// The constructor should be called with
// the parent object (optional, defaults to window).

jsi.library.Timer = function()
{
    this.obj = (arguments.length)?arguments[0]:window;
    return this;
}

// The set functions should be called with:
// - The name of the object method (as a string) (required)
// - The millisecond delay (required)
// - Any number of extra arguments, which will all be
//   passed to the method when it is evaluated.

jsi.library.Timer.prototype.setInterval = function(func, msec)
{
    var i = jsi.library.Timer.getNew();
    var t = jsi.library.Timer.buildCall(this.obj, i, arguments);
    jsi.library.Timer.set[i].timer = window.setInterval(t,msec);
    return i;
}
jsi.library.Timer.prototype.setTimeout = function(func, msec)
{
    var i = jsi.library.Timer.getNew();
    jsi.library.Timer.buildCall(this.obj, i, arguments);
    jsi.library.Timer.set[i].timer = window.setTimeout("jsi.library.Timer.callOnce("+i+");",msec);
    return i;
}

// The clear functions should be called with
// the return value from the equivalent set function.

jsi.library.Timer.prototype.clearInterval = function(i){
    if(!jsi.library.Timer.set[i]) return;
    window.clearInterval(jsi.library.Timer.set[i].timer);
    jsi.library.Timer.set[i] = null;
}
jsi.library.Timer.prototype.clearTimeout = function(i){
    if(!jsi.library.Timer.set[i]) return;
    window.clearTimeout(jsi.library.Timer.set[i].timer);
    jsi.library.Timer.set[i] = null;
}

// Private data

jsi.library.Timer.set = new Array();
jsi.library.Timer.buildCall = function(obj, i, args)
{
    var t = "";
    jsi.library.Timer.set[i] = new Array();
    if(obj != window){
        jsi.library.Timer.set[i].obj = obj;
        t = "jsi.library.Timer.set["+i+"].obj.";
    }
    t += args[0]+"(";
    if(args.length > 2){
        jsi.library.Timer.set[i][0] = args[2];
        t += "jsi.library.Timer.set["+i+"][0]";
        for(var j=1; (j+2)<args.length; j++){
            jsi.library.Timer.set[i][j] = args[j+2];
            t += ", jsi.library.Timer.set["+i+"]["+j+"]";
    }}
    t += ");";
    jsi.library.Timer.set[i].call = t;
    return t;
}
jsi.library.Timer.callOnce = function(i){
    if(!jsi.library.Timer.set[i]) return;
    eval(jsi.library.Timer.set[i].call);
    jsi.library.Timer.set[i] = null;
}
jsi.library.Timer.getNew = function(){
    var i = 0;
    while(jsi.library.Timer.set[i]) i++;
    return i;
}
 
/////////////////////////////////////
// Get the current cursor position ///
/////////////////////////////////////

//requires event as an argument
jsi.library.getCursorPosition = function(e) 
{
    e = e || window.event;
    var cursor = {x:0, y:0};
    if (e.pageX || e.pageY) {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    } 
    else {
        var de = document.documentElement;
        var b = document.body;
        cursor.x = e.clientX + 
            (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
        cursor.y = e.clientY + 
            (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
    }
    
    return cursor;
}

//////////////////
// Get an object  ///
///////////////////


/** Generic object retrival.
 *
 * Finds and returns an object via its ID in the DOM 
 */
jsi.library.findObject = function(n, d) 
{ 
    var p,i,x;  
    
    if(!d) 
    { 
        d=document; 
    } 
    
    if ((p=n.indexOf("?")) > 0 && parent.frames.length) 
    {
        d = parent.frames[n.substring(p+1)].document; 
        n = n.substring(0,p);
    }
    
    if (!(x=d[n]) && d.all) 
    {
        x=d.all[n];
    }
    
    for (i=0;!x && i < d.forms.length; i++) 
    { 
        x=d.forms[i][n];
    }
    
    for (i=0; !x && d.layers && i < d.layers.length; i++)
    {
        x = jsi.library.findObject(n,d.layers[i].document); 
    }
    
    if(!x && d.getElementById) 
    {
        x=d.getElementById(n);
    }
    
    return x;
}
/**************************************/
