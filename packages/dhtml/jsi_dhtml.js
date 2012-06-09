/** 
 * Generic DHTML package
 * 
 * @project jsi:javascript.interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 * 
 * @package dhtml
 */


jsi.dhtml.Attribute = function(name, value)
{
    this.name = name;
    
    this.value = value;
}


jsi.dhtml.Element = function(idOrElement)
{
    this.id;
    this.object; 
    
    if (idOrElement == null)
    {
        return;
    }
    
    if (typeof(idOrElement) == "string")
    {
        this.id = idOrElement;
    }
    else
    {
        this.object = idOrElement;
        this.id = this.object.id;
    }
    
    this.idOrElement = idOrElement;
}

    
    jsi.dhtml.Element.prototype.loadObject = function()
    {
        if (this.object == null)
        {
            this.object = jsi.library.findObject(this.id);
        }
        if (this.object == null)
        {
            throw("DHTML.Element(id="+this.id+"): The object cannot be found in the DOM.\n Are you trying to modify the element before it has been read into the DOM (are you calling it in the header, or in the body inside a script tag before the node itself)? ");
        }

    }
    
    jsi.dhtml.Element.prototype.hasAttributes = function()
    {
        this.loadObject();
        
        return this.object.attributes != null;
    }
    
   
    /** Implemented Methods **/
    jsi.dhtml.Element.prototype.getObject = function()
    {
        this.loadObject();
        
        return this.object;
    }
    
    jsi.dhtml.Element.prototype.getValue = function()
    {
        this.loadObject();    
        
        return this.object.innerHTML;
    }
    
    
    jsi.dhtml.Element.prototype.setValue = function(text)
    {
        this.loadObject();
       
        this.object.innerHTML = text;   
    }

    jsi.dhtml.Element.prototype.getTagName = function()
    {
        this.loadObject();
        
        return this.object.nodeName.toLowerCase();
    }
    
    jsi.dhtml.Element.prototype.getChildNodes = function()
    {
        this.loadObject();
        
        tmp = new Array();
        
        for (var i=0; i < this.object.childNodes.length; i++)
        {
            tmp.push(new jsi.dhtml.Element(this.object.childNodes[i]));    
        }
        
        return tmp;
    }
    
    jsi.dhtml.Element.prototype.isCheckitemInput = function()
    {
        this.loadObject();
        
        type = this.getAttribute("type");
        
        return this.getTagName() == "input" && 
            (type == "checkbox" || type == "radio"); 
    
    }
    
    jsi.dhtml.Element.prototype.getContent = function()
    {
        this.loadObject();
        
        children = this.getChildNodes();
        
        if (this.object.nodeValue != null)
        {
            content = this.object.nodeValue;
        }
        else
        {
            content = "";
        }
        
        for (var i in children)
        {
            content += children[i].getContent();
        }
        
        return content;
    
    }
    
    jsi.dhtml.Element.prototype.cloneNode = function(deep)
    {
        this.loadObject();
        
        clone = new jsi.dhtml.Element(this.object.cloneNode(deep));
    
        clone = jsi.dhtml.resetElement(clone);
        
        return clone;
    }
    
    jsi.dhtml.Element.prototype.hasChildren = function()
    {
        this.loadObject();
        
        return this.object.hasChildNodes();
    }
    
    jsi.dhtml.Element.prototype.getFirstChild = function()
    {
        this.loadObject();
        
        return new jsi.dhtml.Element(this.object.firstChild);
    }
    
    jsi.dhtml.Element.prototype.getCode = function()
    {
        this.loadObject();
        
        tmp = jsi.dhtml.createElement("span");
        
        /* NOTE: Not working as expected. Feb7/07
        //IE 6 + workaround for name and checked attributes
        if (this.getTagName() == "input" && 
            (this.getAttribute("name") != null || 
             this.getAttribute("checked") != null))
        {
            //must create a new element with all the attributes 
            tmp.appendChildElement(jsi.dhtml.createNamedElement("input",this.getAttributes()));
        
        }
        else
        {
        
            tmp.appendChildElement(this);
        
        }*/
        
        tmp.appendChildElement(this);
        
        
        return tmp.getValue();
    }
    
    jsi.dhtml.Element.prototype.isFormInput = function()
    {
        var nodeName = this.getTagName();
        
        return  nodeName.toLowerCase() == "input" || 
                nodeName.toLowerCase() == "select" || 
                nodeName.toLowerCase() == "textarea"; 
    }
    
    jsi.dhtml.Element.prototype.clear = function() 
    {
        this.setValue("");
    }
   
    jsi.dhtml.Element.prototype.canBeSeen = function()
    {
        this.loadObject(); 
        return this._recurseCanBeSeen(this.object);
    }
   
    //private method
    jsi.dhtml.Element.prototype._recurseCanBeSeen = function(node)
    {
        if (node == null || node.style == null)
        {
            return true; 
        }
        
        if (node.style.display == "none" || node.style.visibility == "hidden")
        {
            return false;
        }
        
        return this._recurseCanBeSeen(node.parentNode);
    }
    
    //Style functions
    jsi.dhtml.Element.prototype.getVisibility = function()
    {
        this.loadObject(); 
        return this.object.style.visibility;
    }
    
    jsi.dhtml.Element.prototype.setVisibility = function(status)
    {
        this.loadObject();
        
        if (status)
        {
            this.object.style.visibility="visible";
        }
        else
        {
            this.object.style.visibility="hidden";
        }
    }
    
    jsi.dhtml.Element.prototype.toggleVisibility = function()
    {
        if (this.getVisibility() == "hidden")
        {
            this.setVisibility(true);
            return true;
        }    
        else
        {
            this.setVisibility(false);
            return false;
        }
    }
    
    
    jsi.dhtml.Element.prototype.getDisplay = function()
    {
        this.loadObject(); 
        return this.object.style.display;
    }
    
    jsi.dhtml.Element.prototype.setDisplay = function(status, type)
    {
        this.loadObject();
        var onType = "";
        
        if (type != null) 
        {
            onType = type;
        }
        
        if (status)
        {
            this.object.style.display=onType;
        }
        else
        {
            this.object.style.display="none";
        }
    }
    
    jsi.dhtml.Element.prototype.toggleDisplay = function(type)
    {
        if (this.getDisplay() == "none")
        {
            this.setDisplay(true, type);
            return true;
        }    
        else
        {
            this.setDisplay(false, type);
            return false;
        }
    }
    
    jsi.dhtml.Element.prototype.getColour = function()
    {
        this.loadObject();
        
        return this.object.style.color;
    }
    
    jsi.dhtml.Element.prototype.setColour = function(colour) 
    {
        this.loadObject();
        
        this.object.style.color = colour;
    } 
    
    jsi.dhtml.Element.prototype.getBackgroundColour = function()
    {
        this.loadObject();
        
        return this.object.style.backgroundColor;
    }
    
    jsi.dhtml.Element.prototype.setBackgroundColour = function(bgColour) 
    {
        this.loadObject();
        
        this.object.style.backgroundColor = bgColour;
    } 
    
    jsi.dhtml.Element.prototype.getOpacity = function()
    {
		this.loadObject();
		
		if (this.object.style.MozOpacity!=null) 
		{
			// Mozilla's pre-CSS3 proprietary rule 
			return this.object.style.MozOpacity*100;
		} 
		else if (this.object.style.opacity!=null) 
		{
			// CSS3 compatible (used by newer FireFox, Opera and Safari)
			return this.object.style.opacity*100;
		} 
		else if (this.object.style.filter!=null) 
		{
			// IE's proprietary filter 
			return parseInt(this.object.style.filter.replace("alpha(opacity=","").replace(")",""));
		}
		else if (this.object.style.KhtmlOpacity!=null) 
		{
			// Konquerer 
			return this.object.style.KhtmlOpacity*100;
		}
		else
		{
			return false;
		}
    }
    
    jsi.dhtml.Element.prototype.setOpacity = function(percentage)
    {
		this.loadObject();
		
		if (this.object.style.MozOpacity!=null) 
		{
			// Mozilla's pre-CSS3 proprietary rule 
			this.object.style.MozOpacity = (percentage/100);
			//this.object.style.MozOpacity = (percentage/100)-.001;
		} 
		else if (this.object.style.opacity!=null) 
		{
			// CSS3 compatible (used by newer FireFox, Opera and Safari)
			this.object.style.opacity = (percentage/100);
			//this.object.style.opacity = (percentage/100)-.001;
		} 
		else if (this.object.style.filter!=null) 
		{
			// IE's proprietary filter 
			this.object.style.filter = "alpha(opacity="+percentage+")";
			// worth noting: IE's opacity needs values in a range of 0-100, not 0.0 - 1.0 
		}
		else if (this.object.style.KhtmlOpacity!=null) 
		{
			// Konquerer
			this.object.style.KhtmlOpacity = (percentage/100); 
			//this.object.style.KhtmlOpacity = (percentage/100)-.001;
		}
		else
		{
			return false;
		}
		
		return true;
    }
  
    jsi.dhtml.Element.prototype.mirror = function(mirrorTo)
    {
        this.setValue(mirrorTo.getValue());
    }
    
    jsi.dhtml.Element.prototype.getTop = function()
    {
        this.loadObject();
        
        return this.object.style.top;
    }
    
    jsi.dhtml.Element.prototype.setTop = function(value)
    {
        this.loadObject();
        
        this.object.style.top = value;
    }
    
    jsi.dhtml.Element.prototype.getLeft = function()
    {
        this.loadObject();
        
        return this.object.style.left;
    }
    
    jsi.dhtml.Element.prototype.setLeft = function(value)
    {
        this.loadObject();
        
        this.object.style.left = value;
    }
    
    jsi.dhtml.Element.prototype.getOffsetTop = function()
    {
        this.loadObject();
        return this._getOffsetTop(this.object);    
    }
        //Private
        jsi.dhtml.Element.prototype._getOffsetTop = function(obj)
        {
            if (obj == null)
            {
                return 0;
            }
            else
            {
                return obj.offsetTop + this._getOffsetTop(obj.offsetParent);
            }   
        }
   
   
    jsi.dhtml.Element.prototype.getOffsetLeft = function()
    {
        this.loadObject();
        
        return this._getOffsetLeft(this.object);    
    }
        //Private
        jsi.dhtml.Element.prototype._getOffsetLeft = function(obj)
        {
            if (obj == null)
            {
                return 0;
            }
            else
            {
                
                return obj.offsetLeft + this._getOffsetLeft(obj.offsetParent);
            }   
        }     
        
    jsi.dhtml.Element.prototype.getOffsetHeight = function()
    {
        this.loadObject();
        
        return this._getOffsetHeight(this.object);    
    }
        //Private
        jsi.dhtml.Element.prototype._getOffsetHeight = function(obj)
        {
            if (obj == null)
            {
                return 0;
            }
            else
            {
                return obj.offsetHeight + this._getOffsetHeight(obj.offsetParent);
            }   
        }  
        
    jsi.dhtml.Element.prototype.getOffsetWidth = function()
    {
        this.loadObject();
        
        return this._getOffsetWidth(this.object);    
    }
        //Private
        jsi.dhtml.Element.prototype._getOffsetWidth = function(obj)
        {
            if (obj == null)
            {
                return 0;
            }
            else
            {
                return obj.offsetWidth + this._getOffsetWidth(obj.offsetParent);
            }   
        } 
        
    jsi.dhtml.Element.prototype.getAttribute = function(name)
    {
        this.loadObject();
        
        return this.object.getAttribute(name);
    }
    
    jsi.dhtml.Element.prototype.setAttribute = function(name, value)
    {
        this.loadObject();
        
        return this.object.setAttribute(name, value);
    }
    
    jsi.dhtml.Element.prototype.removeAttribute = function(name)
    {
        this.loadObject();
        
        this.object.removeAttribute(name);
    }
    
    jsi.dhtml.Element.prototype.getCssClass = function(value)
    {
        this.loadObject();
        
        var className = this.object.getAttribute("class");
        
        if (!className)
        {
            return this.object.getAttribute("className");
        }
        else
        {
            return className;
        }
    }
    
    jsi.dhtml.Element.prototype.setCssClass = function(value)
    {
        this.loadObject();
        
        this.object.setAttribute("class",value);
        
        //for IE only
        this.object.setAttribute("className",value);
    }
    
    jsi.dhtml.Element.prototype.getCursor = function()
    {
        this.loadObject();
        return this.object.style.cursor;
    }
    
    jsi.dhtml.Element.prototype.getAttributes = function()
    {
        this.loadObject();
        attrs = this.object.attributes;
       
        var tmp = new Array();
        
        for (var i = 0; i < attrs.length; i++)
        {
            if (attrs[i].nodeValue != null && attrs[i].nodeValue != "")
            {
                tmp.push(new jsi.dhtml.Attribute(attrs[i].nodeName, attrs[i].nodeValue));    
            }
        }
        
        return tmp;
    }
    
    jsi.dhtml.Element.prototype.setCursor = function(type)
    {
        this.loadObject();
        this.object.style.cursor = type;
    }
    
    jsi.dhtml.Element.prototype.appendChildElement = function(element)
    {
        this.loadObject();
        element.loadObject();
        
        newElement = new jsi.dhtml.Element(this.object.appendChild(element.object));
        
        //in case element is a formitem or another
    //    newElement = jsi.dhtml.resetElement(newElement);
        
        return newElement;
    }    
    
    jsi.dhtml.Element.prototype.removeChildElement = function(element)
    {
        this.loadObject();
        element.loadObject();
        
        this.object.removeChild(element.object);
    }
    
    jsi.dhtml.Element.prototype.getBackgroundImage = function()
    {
        this.loadObject();
        
        return this.object.style.backgroundImage;
    }
    
    jsi.dhtml.Element.prototype.setBackgroundImage = function(url)
    {
        this.loadObject();
        
        this.object.style.backgroundImage = url;
    }
    
    
    jsi.dhtml.Element.prototype.getProperty = function(name, required, defaultVal)
    {
    
        var attr = this.getAttribute(name);
        
        if (attr == null)
        {
            if (required)
            {
                throw("DHTML.Element(id="+this.id+").getProperty(\""+name+"\"): The element is missing the required attribute."); 
            }
            else
            {
                return defaultVal;
            }
        }
        else
        {
            return attr;
        }
    }
    
    jsi.dhtml.Element.prototype.remove = function()
    {
        this.loadObject();
        
        this.object.parentNode.removeChild(this.object);
    }
    
    
    jsi.dhtml.Element.prototype.getParent = function()
    {
        this.loadObject();
        
        return new jsi.dhtml.Element(this.object.parentNode);
    }
    
    jsi.dhtml.Element.prototype.getPreviousSibling = function()
    {
        this.loadObject();
        
        if (this.object.previousSibling)
        {
            return new jsi.dhtml.Element(this.object.previousSibling);
        }
    }
    
    jsi.dhtml.Element.prototype.getNextSibling = function()
    {
        this.loadObject();
        
        if (this.object.nextSibling)
        {
            return new jsi.dhtml.Element(this.object.nextSibling);
        }
    }
    
    jsi.dhtml.Element.prototype.moveBeforeElement = function(elementRef)
    {
        var parent = this.getParent();
        
        parent.insertElementBeforeChild(this,elementRef);
    
    }
    
    jsi.dhtml.Element.prototype.insertElementBeforeChild = function(newElement,refElement)
    {
        this.loadObject();
        newElement.loadObject();
        refElement.loadObject();
        
        this.object.insertBefore(newElement.object,refElement.object);
    }
    
   jsi.dhtml.Element.prototype.getElementsByTagName = function(tag)
    {
    
        this.loadObject();
        
        output = new Array();
        
        items = null;
        
        if (!this.object.getElementsByTagName)
        {
           //IE workaround for XML Documents
           //alert("IE Workaround.");
           items = this.object.ownerDocument.getElementsByTagName(tag);
        }
        else
        {
            items = this.object.getElementsByTagName(tag);
        }
        
        for (var i = 0; i < items.length; i++)
        {
            output.push(new jsi.dhtml.Element(items[i]));    
        }
        
        return output;
    }
    
    //IE Workaround - not reqd.
    /*
    this._ie_getElementsByTagName = function(tag)
    {
    
        this.loadObject();
        
        output = new Array();
        
        children = this.object.getChildNodes();
        
        alert(children.length+this.getTagName());
        return;
        
        for (var i in children)
        {
            if (children[i].getTagName().toLowerCase() == tag.toLowerCase())
            {
            
                output.push(children[i]);
            }
            
            output = output.concat(children[i]._ie_getElementsByTagName(tag));
        }
        
        return output;
    }*/
    
     /** Event handlers **/
    jsi.dhtml.Element.prototype.addMouseOverEvent = function(handler)
    {
        this.loadObject();
        this.object.onmouseover = handler;
    }
    
    jsi.dhtml.Element.prototype.addMouseOutEvent = function(handler)
    {
        this.loadObject();
        this.object.onmouseout = handler;
    }
    
    jsi.dhtml.Element.prototype.addMouseDownEvent = function(handler)
    {
        this.loadObject();
        this.object.onmousedown = handler;
    }
    
    
//Form class
jsi.dhtml.Form = function(idOrElement)
{
    jsi.dhtml.Element.call(this, idOrElement);
}

    jsi.dhtml.Form.prototype = new jsi.dhtml.Element;

    /** Event handlers **/
    jsi.dhtml.Form.prototype.addSubmitEvent = function(handler)
    {
        this.loadObject();
        
        this.object.onsubmit = handler;
    }
    
    jsi.dhtml.Form.prototype.addResetEvent = function(handler)
    {
        this.loadObject();
        
        this.object.onreset = handler;
    }
    
    jsi.dhtml.Form.prototype.submit = function()
    {
        this.loadObject();
        
        this.object.submit();
    }
    
    jsi.dhtml.Form.prototype.reset = function()
    {
        this.loadObject();
        
        this.object.reset();
    }


jsi.dhtml.Formitem = function(idOrElement)
{
   jsi.dhtml.Element.call(this, idOrElement);
}

jsi.dhtml.Formitem.prototype = new jsi.dhtml.Element;
 

    /** Overridden methods **/
    jsi.dhtml.Formitem.prototype.getValue = function()
    {
        this.loadObject();
        
        return this.object.value;
    }
    
    jsi.dhtml.Formitem.prototype.setValue = function(value)
    {
        this.loadObject();
        
        this.object.value = value;   
    } 
     
    /** New methods **/
    jsi.dhtml.Formitem.prototype.getReadonly = function()
    {
        this.loadObject();
        return this.object.readOnly;
    }
    
    jsi.dhtml.Formitem.prototype.setReadonly = function(status)
    {
        this.loadObject();
        this.object.readOnly = status;
    }
    
    jsi.dhtml.Formitem.prototype.getActivation = function()
    {
        this.loadObject();
        return this.object.disabled;
    }
    
    jsi.dhtml.Formitem.prototype.setActivation = function(status)
    {
        this.loadObject();
        this.object.disabled = status;
    }
    
    
    /** Event handlers **/
    jsi.dhtml.Formitem.prototype.addKeyPressEvent = function(handler)
    {
        this.loadObject();
        this.object.onkeypress = handler;
    }
    
    jsi.dhtml.Formitem.prototype.addKeyDownEvent = function(handler)
    {
        this.loadObject();
        this.object.onkeydown = handler;
    }
    
    jsi.dhtml.Formitem.prototype.addKeyUpEvent = function(handler)
    {
        this.loadObject();
        this.object.onkeyup = handler;
    }
    
    jsi.dhtml.Formitem.prototype.addClickEvent = function(handler)
    {
        this.loadObject();
        this.object.onclick = handler;
    }
    
    jsi.dhtml.Formitem.prototype.addChangeEvent = function(handler)
    {
        this.loadObject();
        this.object.onchange = handler;
    }
    
    jsi.dhtml.Formitem.prototype.addFocusEvent = function(handler)
    {
        this.loadObject();
        this.object.onfocus = handler;
    }
    
    jsi.dhtml.Formitem.prototype.addBlurEvent = function(handler)
    {
        this.loadObject();
        this.object.onblur = handler;
    }
    
    jsi.dhtml.Formitem.prototype.getForm = function()
    {
        this.loadObject();
        return this.object.form;
    }




jsi.dhtml.Checkitem = function(idOrElement)
{
    jsi.dhtml.Formitem.call(this, idOrElement);
}

    jsi.dhtml.Checkitem.prototype = new jsi.dhtml.Formitem;
    
    
    /** Methods **/
    jsi.dhtml.Checkitem.prototype.getChecked = function()
    {
        this.loadObject();
        return this.object.checked;
    }
    
    jsi.dhtml.Checkitem.prototype.setChecked = function(value)
    {
        this.loadObject();
        this.object.checked = value;
    }
    
    /** Overridden methods **/
    jsi.dhtml.Checkitem.prototype.clear = function()
    {
        this.setChecked(false);
    }
    
    jsi.dhtml.Checkitem.prototype.mirror = function(mirrorTo)
    {
        if (!mirrorTo.getChecked)
        {
            throw("DHTML.Element_Formitem_Checkitem.mirror(): mirror only accepts one argument of type: Element_Formitem_Checkitem");
        }
        
        this.setChecked(mirrorTo.getChecked());
    }
    



jsi.dhtml.Selectoption = function(idOrElement)
{
   jsi.dhtml.Formitem.call(this, idOrElement);
}

    jsi.dhtml.Selectoption.prototype = new jsi.dhtml.Formitem;
    
    
    jsi.dhtml.Selectoption.prototype.setDisplay = function(display)
    {
        this.loadObject();
        
        this.object.text = display;
    }



jsi.dhtml.Selectbox = function(idOrElement)
{
    jsi.dhtml.Formitem.call(this, idOrElement);
}

    jsi.dhtml.Selectbox.prototype = new jsi.dhtml.Formitem; 
    
      
    jsi.dhtml.Selectbox.prototype.clearOptions = function()
    {
        this.loadObject();
        
        var length = this.object.length;
        
        for (var i = length; i >= 0; i--)
        {
            this.removeOption(i);
        } 
    }
    
    jsi.dhtml.Selectbox.prototype.removeOption = function(index)
    {
        this.loadObject();
       
        this.object.remove(index);
    }
    
    jsi.dhtml.Selectbox.prototype.addOption = function(value, display)
    {
        this.loadObject();
        
        
        var option = jsi.dhtml.createElement("option");
        //option.resetElementType();
		option.setValue(value);
	    option.setDisplay(display);
        
        try
        {
            this.object.add(option.getObject(),null);
        }
        catch(ex)
        {
            
            this.object.add(option.getObject());
        }
        
        return option;
    }
       
    jsi.dhtml.Selectbox.prototype.sortAsc = function()
    {
        //TODO
    }
    
    jsi.dhtml.Selectbox.prototype.sortDesc = function()
    {
        //TODO
    }
    
    jsi.dhtml.Selectbox.prototype.sort = function()
    {
        //TODO:: Include elements to skip (int[])
        
        this.loadObject();
        var optArr = new Array();
        
        
        function _MyOption(value, text)
        {
            this.value = value;
            this.text = text;
        }

        for (var i = 0; i < this.object.options.length; i++)
        {
            if (i == 0) 
            {
                continue;
            }
            
            optArr.push(new _MyOption(this.object.options[i].value,this.object.options[i].text));
        }
        
        optArr.sort(function(a,b){if (a.text.toLowerCase() > b.text.toLowerCase()) return 1; else return -1;});
        
        for (var i = 0; i<this.object.options.length; i++)
        {
            if (!i == 0) 
            {
                this.object.options[i].text = optArr[i-1].text;
                this.object.options[i].value = optArr[i-1].value;
            }
        } 
    
    }




/////////////////////////
//// Collections ////////
////////////////////////

jsi.dhtml.Collection = function()
{
    this.children = new Array();
}

    jsi.dhtml.Collection.prototype.addChild = function(Element)
    {
        this.children[this.children.length] = Element;
    }
    
    jsi.dhtml.Collection.prototype.getChild = function(id)
    {
        for (var i in this.children)
        {
            if (this.children[i].id == id) 
            { 
                return this.children[i];
            }
        }
        throw("jsi.dhtml.Collection.getChild("+id+"): Cannot be found");   
    }
    
    jsi.dhtml.Collection.prototype.getValueFromId = function(id) 
    {
        return this.getChild(id).getValue();
    }
    
    jsi.dhtml.Collection.prototype.setValueFromId = function(id, value)
    {
        this.getChild(id).setValue(value);
    }
    
    jsi.dhtml.Collection.prototype.getValueArray = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getValue();
        }
        
        return tmp;
    }
    
    jsi.dhtml.Collection.prototype.setValueArray = function(inArray)
    {
        if (inArray.length != this.children.length)
        {
            throw("jsi.dhtml.Collection.setValueArray(): provided array length of "+inArray.length+" doesn't match length of this object: "+this.children.length);
        }
        
        for (var i in this.children)
        {
            this.children[i].setValue(inArray[i]);
        }
    }
   
    
    /** Implemented Methods **/
    jsi.dhtml.Collection.prototype.getValue = function(id)
    {
        return this.getValueFromId(id);
    }
    
    jsi.dhtml.Collection.prototype.setValue = function(id, value)
    {
        this.setValueFromId(id, value);
    }
    
    jsi.dhtml.Collection.prototype.getTagName = function()
    {
        var results = new Array();
        
        for (var i in this.children)
        {
            results.push(this.children[i].getTagName());
        }
        
        return results;
    }
    
    jsi.dhtml.Collection.prototype.clear = function()
    {
        for (var i in this.children)
        {
            this.children[i].clear();
        }
    }
    
    jsi.dhtml.Collection.prototype.mirror = function(ElementCollection) 
    {
        if (!ElementCollection.children || this.children.length != ElementCollection.children.length)
        {
            throw("jsi.dhtml.Collection.mirror(): Input formitem has an incorrect number of children.");
        }
        
        for (var i in this.children)
        {
            this.children[i].mirror(ElementCollection.children[i]);
        }
    }
    
    jsi.dhtml.Collection.prototype.getObject = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getObject();
        }
        
        return tmp; 
    }
    
    jsi.dhtml.Collection.prototype.getVisibility = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getVisibility();
        }
        
        return tmp; 
    }
    
    jsi.dhtml.Collection.prototype.setVisibility = function(status)
    {
        for (var i in this.children)
        {    
            this.children[i].setVisibility(status);
        } 
    }
    
    jsi.dhtml.Collection.prototype.toggleVisibility = function()
    {
        for (var i in this.children)
        {    
            this.children[i].toggleVisibility();
        } 
    }
    
    jsi.dhtml.Collection.prototype.getDisplay = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getDisplay();
        }
        
        return tmp; 
    }
    
    jsi.dhtml.Collection.prototype.setDisplay = function(status, type)
    {
        for (var i in this.children)
        {    
            this.children[i].setDisplay(status, type);
        } 
    }
    
    jsi.dhtml.Collection.prototype.toggleDisplay = function(type)
    {
        for (var i in this.children)
        {    
            this.children[i].toggleDisplay(type);
        } 
    }
    
    jsi.dhtml.Collection.prototype.getColour = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getColour();
        }
        
        return tmp; 
    }
    
    jsi.dhtml.Collection.prototype.setColour = function(colour)
    {
        for (var i in this.children)
        {    
            this.children[i].setColour(colour);
        } 
    }
    
    jsi.dhtml.Collection.prototype.getBackgroundColour = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getBackground();
        }
        
        return tmp; 
    }
    
    jsi.dhtml.Collection.prototype.setBackgroundColour = function(colour)
    {
        for (var i in this.children)
        {    
            this.children[i].setBackgroundColour(colour);
        } 
    }
    
    jsi.dhtml.Collection.prototype.getOpacity = function()
    {
		var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {		
            tmp[tcount++] = this.children[i].getOpacity();
        }
        
        return tmp; 
    }
    
    jsi.dhtml.Collection.prototype.setOpacity = function(opacity)
    {
		for (var i in this.children)
        {    
            this.children[i].setOpacity(opacity);
        } 
    }
    
    jsi.dhtml.Collection.prototype.canBeSeen = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].canBeSeen();
        }
        
        return tmp;   
    }
    
    jsi.dhtml.Collection.prototype.getOffsetTop = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getOffsetTop();
        }
        
        return tmp;  
    }
    
    jsi.dhtml.Collection.prototype.getOffsetLeft = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getOffsetLeft();
        }
        
        return tmp;  
    }
    
    jsi.dhtml.Collection.prototype.getOffsetWidth = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getOffsetWidth();
        }
        
        return tmp;  
    }
    
    jsi.dhtml.Collection.prototype.getOffsetHeight = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getOffsetHeight();
        }
        
        return tmp;  
    }



jsi.dhtml.RadioCollection = function()
{
    jsi.dhtml.Collection.call(this);
} 

    jsi.dhtml.RadioCollection.prototype = new jsi.dhtml.Collection;
    

    jsi.dhtml.RadioCollection.prototype.selectById = function(id)
    {
        for (var i in this.children)
        {
            if (this.children[i].id == id)
            {
                this.children[i].setChecked(true); 
            }
            else 
            {
                this.children[i].setChecked(false); 
            }
        }
    }
    
    jsi.dhtml.RadioCollection.prototype.selectByValue = function(value)
    {
        for (var i in this.children)
        {
            if (this.children[i].getValue() == value)
            {
                this.children[i].setChecked(true); 
            }
            else 
            {
                this.children[i].setChecked(false); 
            }
        }
    }
    
    jsi.dhtml.RadioCollection.prototype.getSelected = function()
    {
        for (var i in this.children)
        {
            if (this.children[i].getChecked() == true)
            {
                return this.children[i];
            }
        }
    }
    
     /** Overridden Methods **/
    jsi.dhtml.RadioCollection.prototype.getValue = function()
    {
        return this.getSelected().getValue();
    }
    
    jsi.dhtml.RadioCollection.prototype.setValue = function(id)
    {
        this.getChild(id).setChecked(true);
    }
    
    jsi.dhtml.RadioCollection.prototype.canBeSeen = function()
    {
        var tmp = false;
        
        for (var i in this.children)
        {
            tmp = tmp || this.children[i].canBeSeen();
        }
        
        return tmp;   
    }
    
    /** Implemented Methods **/
    jsi.dhtml.RadioCollection.prototype.getReadonly = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getReadonly();
        }
        
        return tmp; 
    }
    
    jsi.dhtml.RadioCollection.prototype.setReadonly = function(status)
    {
        for (var i in this.children)
        {    
            this.children[i].setReadonly(status);
        } 
    }
 
    jsi.dhtml.RadioCollection.prototype.getActivation = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            tmp[tcount++] = this.children[i].getActivation();
        }
        
        return tmp; 
    }
    
    jsi.dhtml.RadioCollection.prototype.setActivation = function(status)
    {
        for (var i in this.children)
        {    
            this.children[i].setActivation(status);
        } 
    }
                                              
    jsi.dhtml.RadioCollection.prototype.getProperty = function(name, required, defaultVal)
    {
        var attr = this.children[0].getAttribute(name);
        
        if (attr == null)
        {
            if (required)
            {
                throw("DHTML.ElementCollection_Radio.getProperty(\""+name+"\"): This attribute is required."); 
            }
            else
            {
                return defaultVal;
            }
        }
        else
        {
            return attr;
        }
    }



jsi.dhtml.CheckboxCollection = function()
{
    jsi.dhtml.RadioCollection.call(this);
    
    this.allSelected = false;    
}

    jsi.dhtml.CheckboxCollection.prototype = new jsi.dhtml.RadioCollection;
    

    jsi.dhtml.CheckboxCollection.prototype.selectAll = function()
    {
        for (var i in this.children)
        {
            this.children[i].setChecked(true);
        }
    }
    
    jsi.dhtml.CheckboxCollection.prototype.deselectAll = function()
    {
        for (var i in this.children)
        {
            this.children[i].setChecked(false);
        }
    }
    
    jsi.dhtml.CheckboxCollection.prototype.toggleAll = function()
    {
        if (this.allSelected)
        {
            this.deselectAll();    
        }
        else
        {
            this.selectAll();
        }
        
        this.allSelected = !this.allSelected;
    }
    
    /** Overriden Methods **/
    jsi.dhtml.CheckboxCollection.prototype.selectById = function(ids)
    {
        for (var i in this.children)
        {
            if (jsi.library.searchArray(this.children[i].id, ids))
            {
                this.children[i].setChecked(true); 
            }
            else 
            {
                this.children[i].setChecked(false); 
            }
        }
    }
    
    jsi.dhtml.CheckboxCollection.prototype.selectByValue = function(values)
    {
        for (var i in this.children)
        {
            if (jsi.library.searchArray(this.children[i].getValue(),values))
            {
                this.children[i].setChecked(true); 
            }
            else 
            {
                this.children[i].setChecked(false); 
            }
        }
    }
    
    jsi.dhtml.CheckboxCollection.prototype.getSelected = function()
    {
        var tmp = new Array();
        var tcount = 0;
        
        for (var i in this.children)
        {
            if (this.children[i].getChecked() == true)
            {
                tmp[tcount++] = this.children[i];
            }
        }
        
        return tmp; 
    }
    
   
     jsi.dhtml.CheckboxCollection.prototype.getValue = function(separator)
    {
        var sep = ","; 
        var outputArr = new Array();
        var c = 0;
        
        if (separator)
        {
            sep = separator;
        }
        
        for (var i in this.children)
        {
            if (this.children[i].getChecked() == true)
            {
                outputArr[c++] = this.children[i].getValue();
            }
        }
        
        return outputArr.join(sep);
        
    }
    
    jsi.dhtml.CheckboxCollection.prototype.setValue = function(inIds, separator)
    {
        var sep = ",";
        
        if (separator)
        {
            sep = separator;
        }
        
        var ids = inIds.split(separator);
        
        for (var i in ids)
        {
            this.selectById(ids[i]);
        }
    }
  
