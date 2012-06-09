/** [Package info]. 
 *
 * @project jsi javascript:interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 *
 * @package aspdotnet
 * @dependencies 
 */

//for special asp.net custom controls
jsi.aspdotnet.CustomControl = function(id, name)
{
        this.id = id;

        this.name = name;
}

//optional inheriter
//optional abstract jsi.aspdotnet.CustomControl.prototype.onLoad = function() { }