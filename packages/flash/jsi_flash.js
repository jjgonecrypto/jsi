/** [Package info]. 
 *
 * @project jsi javascript:interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 *
 * @package flash
 * @dependencies dhtml
 */

jsi.flash.Movie = function(name)
{
    this.name = name;
    
    this.object = null;
}

    jsi.flash.Movie.prototype.getObject = function()
    {
        this.object = window.document[this.name];
        
        return this.object;
    }

    jsi.flash.Movie.prototype.isLoaded = function()
    {
        if (this.object == null)
        {
            this.getObject();
        }
        
        if (typeof(this.object) != "undefined")
        {
            return this.percentLoaded() == 100;
        }
        else
        {
            return false;
        }
    
    }

    jsi.flash.Movie.prototype.getVariable = function(name)
    {
        if (!this.isLoaded())
        {
            return false;
        }
        
        return this.object.GetVariable(name);
    }
    
    jsi.flash.Movie.prototype.setVariable = function(name,value)
    {
        if (!this.isLoaded())
        {
            return false;
        }
        
        
        this.object.SetVariable(name,value);
        
        return true;
    }
       
    jsi.flash.Movie.prototype.gotoFrame = function(number)
    {
        if (!this.isLoaded())
        {
            return false;
        }
        
        this.object.GotoFrame(number);
        
        return true;
    }
    
    jsi.flash.Movie.prototype.play = function()
    {
        if (!this.isLoaded())
        {
            return false;
        }
        
        this.object.Play();
        
        return true;
    }
    
    jsi.flash.Movie.prototype.stop = function()
    {
        if (!this.isLoaded())
        {
            return false;
        }
        
        this.object.Stop();
        
        return true;
    }