/** DHTML Calendar. 
 *
 * @project jsi javascript:interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 *
 * @package calendar
 * @dependencies dhtml
 */

jsi.calendar.Calendar = function()
{
    var Today = new Date();
    
    this.curMonth = Today.getMonth();
    
    this.curYear = Today.getFullYear();
    
    this.curDay = Today.getDate();
    
    this.months = new Array("Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec");
    
}

    jsi.calendar.Calendar.prototype.getAsXHTML = function()
    {
        var containerNode = jsi.dhtml.createElement("div");
        
        var tableNode = jsi.dhtml.createElement("table");
        
        containerNode.appendChildElement(tableNode);
        
        var theadNode = jsi.dhtml.createElement("thead");
        
        tableNode.appendChildElement(theadNode);
        
        var trNode = jsi.dhtml.createElement("tr");
        
        theadNode.appendChildElement(trNode);
        
        //PREV LINK
        tdLeftNode = jsi.dhtml.createElement("td");
        
        trNode.appendChildElement(tdLeftNode);
        
        prevAnchorNode = jsi.dhtml.createElement("a");
        
        prevAnchorNode.setAttribute("href","javascript: void(0);");
        prevAnchorNode.setAttribute("onclick","alert('prev');");
        
        prevAnchorNode.setValue("dd");
        tdLeftNode.appendChildElement(prevAnchorNode);
        
        //MONTH
        tdMonthNode = jsi.dhtml.createElement("td");
        
        trNode.appendChildElement(tdMonthNode);
        
        tdMonthNode.setValue(this.months[this.curMonth]);
        
        //NEXT LINK
        tdRightNode = jsi.dhtml.createElement("td");
        
        trNode.appendChildElement(tdRightNode);
        
        nextAnchorNode = jsi.dhtml.createElement("a");
        
        nextAnchorNode.setAttribute("href","javascript: void(0);");
        nextAnchorNode.setAttribute("onclick","alert('next');");
        
        nextAnchorNode.setValue("&#088;");
        tdRightNode.appendChildElement(nextAnchorNode);
        
        
        return containerNode.getValue();
    }
    
    jsi.calendar.Calendar.prototype.monthAfter = function()
    {
    }
    
    jsi.calendar.Calendar.prototype.monthBefore = function()
    {
    }
    