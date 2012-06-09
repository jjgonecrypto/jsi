/** 
 * Animation package
 *
 * @project jsi:javascript.interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 *
 * @package animation
 */


jsi.animation.Animation = function(element, speed, delay, frameCount)
{

    /** Public Properties **/
	this.element = element; 
	
	this.speed = speed;
	this.delay = delay;
	this.frameCount = frameCount; 
	
	
	this.complete = false;
	this.cancelled = false; 
	
	/** Private Properties **/
    this._timer;
    
    this._timerId;
    
    this._delay = (!isNaN(delay) && delay > 0) ? delay : null;
    
    /** Abstract Methods **/
    //this.start = function() { }
    //this.cancel = function() { }
    //this.reset = function() { } 
    //this.restart = function() { }
    //this.finish = function() { }
}
    
    /** Base Methods **/
    jsi.animation.Animation.prototype.baseStart = function()
    {
        if (!this._timer)
		{
			this._timer = new jsi.library.Timer(this);	
		}
		
		if (!this._delay)
		{
			this._timerId = this._timer.setTimeout("start",this.speed);
		}
		else
		{
			this._timerId = this._timer.setTimeout("start",this._delay);
			this._delay = null;
		}
    }
    
    jsi.animation.Animation.prototype.baseCancel = function()
    {
        this.clearTimer();
		
		this.cancelled = true;
		
    }
    
    jsi.animation.Animation.prototype.baseFinish = function()
    {
        this.clearTimer();
        
        this.complete = true;
    }
    
    jsi.animation.Animation.prototype.baseReset = function()
    {
    
		this.clearTimer();
		
		this.complete = false;	
		
		this._delay = this.delay;
		
		//call implemented method
		this.start();
    }
    
    //reset without delay
    jsi.animation.Animation.prototype.baseRestart = function()
    {
		this.clearTimer();
		
		this.complete = false;	
		
		//call implemented method
		this.start();
    }
    
    jsi.animation.Animation.prototype.clearTimer = function()
    {
        if (this._timer) 
		{
			this._timer.clearTimeout(this._timerId);
			this._timer = null;
		}
    }
    
    jsi.animation.Animation.prototype.hasDelay = function()
    {
        return this._delay != null;
    }
    


jsi.animation.AnimationCollection = function()
{
    this.children = new Array();
}

    
    jsi.animation.AnimationCollection.prototype.addChild = function(animation)
    {
        this.children[this.children.length] = animation;
    }
    
    /** Implemented Methods **/
    jsi.animation.AnimationCollection.prototype.start = function() 
    { 
        for (var i in this.children)
        {
            this.children[i].start();
        }
    }
    
    jsi.animation.AnimationCollection.prototype.cancel = function()
    { 
        for (var i in this.children)
        {
            this.children[i].cancel();
        }
    }
    
    jsi.animation.AnimationCollection.prototype.reset = function()
    { 
        for (var i in this.children)
        {
            this.children[i].reset();
        }
    }
    
    jsi.animation.AnimationCollection.prototype.restart = function()
    { 
        for (var i in this.children)
        {
            this.children[i].restart();
        }
    }
    
    jsi.animation.AnimationCollection.prototype.finish = function()
    { 
        for (var i in this.children)
        {
            this.children[i].finish();
        }
    }
    




jsi.animation.AnimationControlFlow = function()
{
  
    this._curActive;
    this._curDeactive;
}

    jsi.animation.AnimationControlFlow.prototype.activate = function(e,animation,doFunction)
    {

        if (this._curDeactive && this._curDeactive.element.id == animation.element.id && !this._curDeactive.complete)
            this._curDeactive.cancel();

        if (this._curActive && this._curActive.element.id == animation.element.id && !this._curActive.complete && !this._curActive.cancelled)
            return;
            
            
        if (doFunction)
        {
            doFunction.call(this,e,animation);
        }
        
        this._curActive = animation;
        
        this._curActive.start();
        
    }


    jsi.animation.AnimationControlFlow.prototype.deactivate = function(e,animation,doFunction)
    { 

        if (this._curActive && this._curActive.element.id == animation.element.id && !this._curActive.complete)
            this._curActive.cancel();

        if (this._curDeactive && this._curDeactive.element.id == animation.element.id && !this._curDeactive.complete && !this._curDeactive.cancelled)
            return;
        
        if (doFunction)
        {
            doFunction.call(this,e,animation);
        }
          
        this._curDeactive = animation;
        
        this._curDeactive.start();
      
    }






jsi.animation.Fade = function(element, opacity, speed, delay, frameCount, isOut)
{

    jsi.animation.Animation.call(this,element, speed, delay, frameCount);
    
	this.opacity = opacity;
	
	//reset framecount to a value we can use as an incrementor
	this.frameCount = (this.frameCount != null && this.frameCount > 0) ? 100 / this.frameCount : 10; 
	
	this.isOut = isOut;
	
    this._opacity = opacity;
    
}
    
    jsi.animation.Fade.prototype = new jsi.animation.Animation;

    jsi.animation.Fade.prototype.start = function()
    {
        //test for delay
        if (this.hasDelay())
        {
            this.baseStart();
            return;
        }
        
        //if finished
		if ((!this.isOut && this._opacity > 100) || (this.isOut && this._opacity < 0))
		{
		    this.finish();
		    return;
		}
		
		
		this.element.setOpacity(this._opacity);
         
		
		if (this.isOut)
		{
			this._opacity -= this.frameCount;
		}
		else
		{
			this._opacity += this.frameCount;
		}
		
		this.baseStart();
    }
    
    jsi.animation.Fade.prototype.cancel = function()
    {
        this.baseCancel();
        
        this.element.setOpacity(this.opacity);
    }
    
    jsi.animation.Fade.prototype.reset = function()
    {
        this._opacity = this.opacity;
        
        this.baseReset();
    }
    
    jsi.animation.Fade.prototype.restart = function()
    {
        this._opacity = this.opacity;
        
        this.baseRestart();
    }
    
    jsi.animation.Fade.prototype.finish = function()
    {
        this.baseFinish();
        
        if (this.isOut)
        {
            this.element.setOpacity(0);
        }
        else
        {
            this.element.setOpacity(100);
        }
    }