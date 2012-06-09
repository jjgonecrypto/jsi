/** Represents a dynamic table on a website.  
 * 
 * @project jsi:javascript.interface
 * @author Justin J. Moses
 * @copyright © 2007 : Justin J. Moses
 * @licence http://web.justinjmoses.com.au/jsi
 * 
 * @package table
 */


jsi.table.Table = function(parentElement)
{
    this.id = null;
    
    this.parent = parentElement;
    
    this.rows = new Array();

    this.columns = new Array();
    
    
    this.cssClass = null;
    
    this.headingCssClass = null;
    
    this.columnsCssClass = null;
    
    this.footerCssClass = null;
    
    //these can be text or Elements
    this.heading = null; 
    this.footing = null;
    
    
    //the table renderer
    this.renderer = null;
    
    //internal counter
    this._indexCounter = 0;
    
    //flag to signal if table contains form INPUT (or select/textarea)
    this.hasInputElements = false;

    
    this._currentColId = null; 
    this._currentSortToggle = null;
    
    var self = this;
    
    this._doSort = function(a,b)
    {
    
        aCell = a.getCell(self._currentColId);
        
        bCell = b.getCell(self._currentColId);
        
        aVal =  aCell.getValue();
        bVal = bCell.getValue();
        
        if (!isNaN(aVal) && !isNaN(bVal))
        {
            //do numeric sorting
            return aVal - bVal;
        }
        else
        {
            if (aVal > bVal)
            {
                return 1;
            }
            else
            {
                return -1;
            }
        }
    }
    
    //append this table to the list
    jsi.table.appendTable(this);

}    
    
    jsi.table.Table.prototype.addRow = function(newRow)
    {
        this.rows.push(newRow);
        
        newRow.table = this;
        
        //set internal index
        newRow.index = this._indexCounter++;
      
    }
    
    jsi.table.Table.prototype.addColumn = function(newColumn)
    {
        this.columns.push(newColumn);
        
        newColumn.table = this;
    }
    
    //helper function
    jsi.table.Table.prototype.newColumn = function(heading, id)
    {
        var newCol = new jsi.table.Column(heading, id);
        
        this.addColumn(newCol);
        
        return newCol;
    } 
    
    jsi.table.Table.prototype.findColumn = function(colId)
    {
        for (var i in this.columns)
        {
            col = this.columns[i];
            
            if (col.id == colId)
            {
                return col;
            }
        }   
        
        return null;
    }
    
    jsi.table.Table.prototype.newRow = function()
    {
        var newRow = new jsi.table.Row();
        
        this.addRow(newRow);
        
        return newRow;
    }
    
    jsi.table.Table.prototype.removeRow = function(index)
    {
        if (index != null)
        {
            if (this.getRow(index) == null)
            {
                throw("Cannot remove row: " + index + ". It doesn't exist.");
            }
            
            var tmp = new Array();

            for (var i in this.rows)
            {
                if (this.rows[i].index != index)
                {
                    tmp.push(this.rows[i]);
                }
            }

            this.rows = tmp;  
             
        }
        else if (this.rows.length > 0)
        {
            //remove the last row
            this.rows.pop();
            
        }
    }
    
    jsi.table.Table.prototype.getLastRow = function()
    {
        if (this.rows.length > 0)
        {
            return this.rows[this.rows.length - 1];
        }
        else
        {
            return null;
        }
    }
    
    //NOTE: element
    jsi.table.Table.prototype.loadFromXML = function(element)
    {
        //this element contains the xml, so search through it
        
        //<(data)>
            //<columns>
                //<column heading="[column heading]">[column name]</column>
            //</columns>
            //<row>
                //<[column name]>[column data]</[column name]>
                //<[column name]>[column data]</[column name]>
                //...
        
       
        var dataNode = element.getFirstChild();
         
        var columnNodes = dataNode.getElementsByTagName("column");
        
        
        for (var x in columnNodes)
        {
            col = columnNodes[x];
            
            xss = this.newColumn(col.getAttribute("heading"), col.getContent());
        }
    
        
        var rowNodes = dataNode.getElementsByTagName("row");
        
        for (var i in rowNodes)
        {
            rowNode = rowNodes[i];
            
            
            row = this.newRow();
            
            row.attributes = rowNode.getAttributes();
            
            cellNodes = rowNode.getChildNodes();
            
            for (var y in cellNodes)
            {
                cell = cellNodes[y];
                
                //check cell column exists
                curColumn = this.findColumn(cell.getTagName());
                
                if (curColumn != null)
                {
                    if (cell.getAttribute("element") != null)
                    {
                        elementTag = cell.getAttribute("element");
                        nameAttribute = cell.getAttribute("name");
                        
                        //do a special cell
                        if (nameAttribute != null)
                        {
                            //get around IE bug with library function 
                            newElement = jsi.dhtml.createNamedElement(elementTag, new Array(new jsi.dhtml.Attribute("name",nameAttribute)));
                        }
                        else
                        {
                            newElement = jsi.dhtml.createElement(elementTag);
                        }
                        
                        attrs = cell.getAttributes();
                        
                        for (var j in attrs)
                        {
                            newElement.setAttribute(attrs[j].name,attrs[j].value);
                        }
                     
                        row.newCell(curColumn, newElement);
                    }
                    else if (cell.hasChildren())
                    {
                        content =  cell.getContent();
                    
                        row.newCell(curColumn, content);
                    }
                    else
                    {
                        row.newCell(curColumn, "");
                    }
                }
            }
        }
        
    }
    
   
    
    jsi.table.Table.prototype.getRow = function(index)
    {
        for (var u in this.rows)
        {
            if (this.rows[u].index == index)
            {
                return this.rows[u];
            }
        }
        return null;
    }
    
    jsi.table.Table.prototype.getAsXHTML = function(start, limit, doPaging, doSorting)
    {
         //build the table
        
        var containerNode = jsi.dhtml.createElement("div");
        
        var tableNode = jsi.dhtml.createElement("table");
        
        tableNode.setAttribute("cellspacing","0");
        tableNode.setAttribute("cellpadding","0");
        
        if (this.cssClass != null)
        {
            tableNode.setCssClass(this.cssClass);
        }
        
        containerNode.appendChildElement(tableNode);
        
        
        var tableHeadNode = jsi.dhtml.createElement("thead");
        
        if (this.heading != null)
        {
            trNode = jsi.dhtml.createElement("tr");
        
            if (this.headingCssClass != null)
            {
                trNode.setCssClass(this.headingCssClass);
            }
            
            tableHeadNode.appendChildElement(trNode);
        
            tdNode = jsi.dhtml.createElement("td");
            
            trNode.appendChildElement(tdNode);
            
            if (this.heading.idOrElement)
            {
                //is Element
                tdNode.setValue(this.heading.getCode());
            }
            else
            {
                tdNode.setValue(this.heading);
            }
            tdNode.setAttribute("colspan",this.columns.length);
        }
        
        
        
        tableNode.appendChildElement(tableHeadNode);
        
        trNode = jsi.dhtml.createElement("tr");
        
        if (this.columnsCssClass != null)
        {
            trNode.setCssClass(this.columnsCssClass);
        }
        
        tableHeadNode.appendChildElement(trNode);
        
        //add column headers
        for (var i in this.columns)
        {
            col = this.columns[i];
            
            tableColNode = jsi.dhtml.createElement("th");
            
            if (doSorting)
            {
                anchor = jsi.dhtml.createElement("a");
                anchor.setAttribute("onclick","jsi.table.sortTable("+this.id+",'"+col.id+"');");
                anchor.setAttribute("href","javascript: void(0);");
                anchor.setValue(col.heading);
                tableColNode.setValue(anchor.getCode());
            }
            else
            {
                tableColNode.setValue(col.heading);
            }
        
            trNode.appendChildElement(tableColNode);
        }
        
        var tableBodyNode = jsi.dhtml.createElement("tbody");
        
        
        tableNode.appendChildElement(tableBodyNode);
        
        for (var i in this.rows)
        {
            row = this.rows[i];
            
            if (doPaging && i < start)
            {
                continue;
            }
            else if (doPaging && i >= limit + start)
            {
                break;
            }
            
            trRowNode = row.getAsXHTML(this.columns);
            
            tableBodyNode.appendChildElement(trRowNode);
            
        }
        
       
       
        //do footer
        tableFooterNode = jsi.dhtml.createElement("tfoot");
            
        if (this.footerCssClass != null)
        {
            tableFooterNode.setCssClass(this.footerCssClass);
        }
    
        tableNode.appendChildElement(tableFooterNode);
        
       
        if (this.footing != null)
        {
            singleTrNode = jsi.dhtml.createElement("tr");
            singleCell = jsi.dhtml.createElement("td");
            singleCell.setAttribute("colspan",this.columns.length);
            
            if (this.footing.idOrElement)
            {
                //is Element
                singleCell.setValue(this.footing.getCode());
            }
            else
            {
                singleCell.setValue(this.footing);
            }
            
            singleTrNode.appendChildElement(singleCell);
            tableFooterNode.appendChildElement(singleTrNode);
        }
        
        
       
        if (doPaging)
        {
            
            singleTrNode = jsi.dhtml.createElement("tr");
            singleCell = jsi.dhtml.createElement("td");
            singleCell.setAttribute("colspan",this.columns.length);
            
            if (start > 0)
            {
                //do a Prev link
                lastpage = Math.max(0, start - limit);
                
                anchor = jsi.dhtml.createElement("a");
                anchor.setAttribute("onclick","jsi.table.goPaging("+this.id+","+lastpage+");");
                anchor.setAttribute("href","javascript: void(0);");
            
                anchor.setValue("&#0171; Prev");
                
                singleCell.appendChildElement(anchor);
                
            }
            
            singleCell.appendChildElement(jsi.dhtml.createTextNode(" "));
            
            if (start + limit < this.rows.length)
            {
                //do a Next link
                nextpage = start + limit;
                
                anchor = jsi.dhtml.createElement("a");
                anchor.setAttribute("onclick","jsi.table.goPaging("+this.id+","+nextpage+");");
                anchor.setAttribute("href","javascript: void(0);");
            
                anchor.setValue("Next &#0187;");
                
                singleCell.appendChildElement(anchor);
            
            }
            
            singleTrNode.appendChildElement(singleCell);
            tableFooterNode.appendChildElement(singleTrNode);
        }
         
        //alert(containerNode.getValue());
        return containerNode.getValue();
    }
    
    
    
    
    jsi.table.Table.prototype.getAsXML = function(columnSubset, ignoreEmptyRows)
    {
        //get data as XML
        data = jsi.dhtml.createElement("data");
        
        //use all columns if parameter is null
        if (columnSubset == null)
        {
            columnSubset = this.columns;
        }
        
        hasSomeData = false;
        
        for (var i in this.rows)
        {
            row = this.rows[i];

            rowNode = row.getAsXML(columnSubset, ignoreEmptyRows);
            
            if (rowNode != null)
            {
                data.appendChildElement(rowNode);
                hasSomeData = true;
            }
        }   
        
        //if no data in rows and ignore empty rows flag is on, then return nothing
        if (!hasSomeData && ignoreEmptyRows)
        {
            return null;
        }
        else
        {
            return data.getCode();
        }
       
    }
    
    jsi.table.Table.prototype.getRenderer = function()
    {
        if (this.renderer == null)
        {
            this.renderer = new jsi.table.Renderer(this);
        }
        return this.renderer;
    }
    
    
    //column can be column id string or column object
    //if ascending is null or omitted, sorting direction is toggled
    jsi.table.Table.prototype.sortRowsBy = function(column, ascending)
    {
    
        var colId;
        
        if (typeof(column) == "string")
        {
            colId = column;
        }
        else if (column.id != null)
        {
            colId = column.id;
        }
        else
        {
            throw("Cannot sort without a valid column or column id.");
        }
    
        this._currentColId = colId;
        
        
        this.rows = this.rows.sort(this._doSort);
    
        if (ascending == false)
        {
            this.rows = this.rows.reverse();
        }
        else if (ascending == null && this._currentSortToggle == true)
        {
            this.rows = this.rows.reverse();
            this._currentSortToggle = false;
        } 
        else if (ascending == null)
        {
            this._currentSortToggle = true;
        }   
        
    }
    
    
    
   
    jsi.table.Table.prototype.moveRowUp = function(row)
    {
        //TODO
    }
    
    
    jsi.table.Table.prototype.moveRowDown = function(row)
    {
        //TODO
    }


jsi.table.Renderer = function(table)
{
    this.table = table;
    
    this.drawn = false;
    
    
    this.start = 0;
    
    this.pageSize = 10;
    
    this.doPaging = true;
    
    this.doSorting = true;
    
    this.theadElement = null;
    this.tbodyElement = null;
    
}
     
    
    jsi.table.Renderer.prototype.setStart = function(index)
    {
        this.start = index;
    }
    
    jsi.table.Renderer.prototype.setPageSize = function(size)
    {
        this.pageSize = size;
    }
    
    jsi.table.Renderer.prototype.showPaging = function(status)
    {
        this.doPaging = status;
    } 
    
    jsi.table.Renderer.prototype.showSorting = function(status)
    {
        this.doSorting = status;
    }
    
    //called to output the table - (will clear any XHTML already outputed)
    jsi.table.Renderer.prototype.draw = function()
    {
        //update any input in our table that may have changed on the page
        this.updateInput();
        
        
        //draw the table to the output 
        var xhtml = this.table.getAsXHTML(this.start, this.pageSize, this.doPaging, this.doSorting);
        
        this.table.parent.setValue(xhtml);
        
 //alert(xhtml);
        
        //set the thead and tbody elements
        this.theadElement = this.table.parent.getElementsByTagName("thead")[0];
        
        this.tbodyElement = this.table.parent.getElementsByTagName("tbody")[0];
        
        this.drawn = true;
    }   
    
    
    jsi.table.Renderer.prototype.updateInput = function()
    {
        //check to retrieve any input elements that may have been rendered
        if (this.drawn && this.table.hasInputElements)
        {
        
            //need to go through the tbody, searching for form input, and 
            //setting the value of the current row's input to that value
            var iarray = this.tbodyElement.getElementsByTagName("input");
            var sarray = this.tbodyElement.getElementsByTagName("select");
            var tarray = this.tbodyElement.getElementsByTagName("textarea");
            
            var allInput = iarray.concat(sarray).concat(tarray);
            
            for (var x in allInput)
            {
                curInput = allInput[x];
                
                curInput = jsi.dhtml.resetElement(curInput);
                
                rowIndex = curInput.getAttribute("jsi_index");
                
                colId = curInput.getAttribute("jsi_column");
                
                affectedRow = this.table.getRow(rowIndex);
                
                if (!affectedRow)
                {
                    //row was deleted
                    continue;
                }
                
                affectedCell = affectedRow.getCell(colId);
                
                if (affectedCell.isCheckitemInput())
                {
                    if (curInput.getChecked())
                    {
                        affectedCell.element.setAttribute("checked","checked");
                    }
                    else
                    {
                        affectedCell.element.removeAttribute("checked");
                    } 
                }
                else
                {
                  // alert("Setting " + affectedCell.row.index + " to " + curInput.getValue());
                    affectedCell.element.setAttribute("value",curInput.getValue());
                }
            }
        }
    
    }



jsi.table.Column = function(heading, id)
{
    this.table = null;

    this.heading = heading;
    
    this.id = id;
}

jsi.table.Row = function()
{
    this.table = null;
 
    this.index = null;
    
    this.cells = new Array();
    
    //collection of DHTML attributes to go onto the TR 
    this.attributes = new Array();
    
}
    
   
    
    jsi.table.Row.prototype.addAttribute = function(attr)
    {
        this.attributes.push(attr);
    }    
    
    jsi.table.Row.prototype.addCell = function(newCell)
    {
        this.cells[newCell.column.id] = newCell;
        
        newCell.row = this;
    }
    
    //column can be object or string (column id)
    jsi.table.Row.prototype.newCell = function(column, value)
    {
        var cell = new jsi.table.Cell(column, value);
        
        this.addCell(cell);
        
        if (cell.isFormInput())
        {
            this.table.hasInputElements = true;
        }
        
        return cell;
    }
    
    jsi.table.Row.prototype.getCell = function(column)
    {
        if (typeof(column) == "string")
        {
            colId = column;
        }
        else if (column.id != null)
        {
            colId = column.id;
        }
        else
        {
            throw("Cannot getCell() without a valid column or column id.");
        } 
        
        return this.cells[colId];
    }
    
    jsi.table.Row.prototype.getCells = function()
    {
        var tmp = new Array();
        
        for (var i in this.table.columns)
        {
            col = this.table.columns[i];
            
            tmp.push(this.cells[col.id]);   
        }
        
        return tmp;
    }
    
    jsi.table.Row.prototype.getAsXHTML = function(columns)
    {
        trRowNode = jsi.dhtml.createElement("tr");
        
        trRowNode.setAttribute("jsi_index",this.index);
      
        //append any attributes
        for (var i in this.attributes)
        {
            trRowNode.setAttribute(this.attributes[i].name, this.attributes[i].value);      
        }
        
        for (var x in columns)
        {
            col = columns[x];
            
            tdNode = jsi.dhtml.createElement("td");
            
            trRowNode.appendChildElement(tdNode);
            
     
            cell = this.getCell(col);
            
            if (cell == null)
            {
                continue;
            }
                
            if (cell.isFormInput())
            {
                //special attributes for form input
                cell.element.setAttribute("jsi_index", this.index);
                cell.element.setAttribute("jsi_column", col.id);
            }
           
            tdNode.setValue(cell.getContent());
        }
        
        return trRowNode;
    }
    
    jsi.table.Row.prototype.getAsXML = function(columnSubset, ignoreEmptyRow)
    {   
        rowNode = jsi.dhtml.createElement("row");
        
        isEmpty = true;
        
        for (var x in columnSubset)
        {
            col = columnSubset[x];
            
            colNode = jsi.dhtml.createElement(col.id);
            
            colData = this.getCell(col).getValue();
            
            colNode.setValue(colData);
            
            if (colData != "" && colData != null)
            {
                isEmpty = false;
            }
            rowNode.appendChildElement(colNode);
        }
        
        if (isEmpty && ignoreEmptyRow)
        {
            return null;
        }
        else
        {
            return rowNode;
        }
    }



//column can be object or ColumnID
//value can be string or Element
jsi.table.Cell = function(column, valueOrElement)
{
    this.row = null; 
    
    if (typeof(column) == "string")
    {
        this.column = this.row.table.findColumn(column);
    }
    else
    {
        this.column = column;
    }
    
    this.value = null;
    
    this.element = null;
    
    //text to sit on the left of the element/value
    this.leftText = null;
    
    //text to sit on the right of the element/value
    this.rightText = null;
    
    if (typeof(valueOrElement) == "object")
    {
        this.element = valueOrElement; 
    } 
    else if (valueOrElement != null)
    {
        this.value = valueOrElement;
    }
    else
    {
        throw("jsi.table.Cell: cannot create new cell without valid value or element.");
    }
}
    
    jsi.table.Cell.prototype.isElement = function()
    {
        return (this.element != null && this.element.idOrElement != null);
    }
    
    jsi.table.Cell.prototype.isFormInput = function()
    {
        return (this.isElement() && this.element.isFormInput());
    }
    
    jsi.table.Cell.prototype.isCheckitemInput = function()
    {
        return this.element.isCheckitemInput();
    }
    
    jsi.table.Cell.prototype.getContent = function()
    {
        if (this.isElement())
        {
            data = this.element.getCode();
        }
        else
        {
            data = this.value;
        }
        
        var lt = "";
        var rt = "";
        
        if (this.leftText != null)
        {
            lt = this.leftText;
        }
        
        if (this.rightText != null)
        {
            rt = this.rightText;
        }
        return lt + data + rt;
        
    }
    
    jsi.table.Cell.prototype.getValue = function()
    {
        if (this.isElement())
        {
            return this.element.getValue();
        }
        else
        {
            return this.value;
        }
    }
    
    jsi.table.Cell.prototype.setValue = function(val)
    {
        if (this.isElement())
        {
            this.element.setAttribute("value",val);
        }
        else
        {
            this.value = val;
        }
    }



//a table for input, using cell templates
jsi.table.InputTable = function(parentElement, outputElement, heading)
{
    jsi.table.Table.call(this,parentElement)

    this.cells = new Array();
   
    this.renderer = this.getRenderer();
    
  
    //NOTE: this means that the output must be a form item
    this.outputElement = outputElement;
    
    
    this.buttonColumn = null;
    
    
	this.heading = heading;
    
    this.init();
    
    //append this table to the list
    jsi.table.appendTable(this);
}
    
    jsi.table.InputTable.prototype = new jsi.table.Table;
    
    
    jsi.table.InputTable.prototype.init = function()
    {
        this.renderer.showPaging(false);
	    this.renderer.showSorting(false);
    }
    
    jsi.table.InputTable.prototype.startup = function()
    {
    
        //ensure if this is a formitem, then it is loaded properly
        this.outputElement = jsi.dhtml.resetElement(this.outputElement);
        
        
        this.buttonColumn = this.newColumn("Opts","__buttons");
	    
    }
    
    jsi.table.InputTable.prototype.draw = function()
    {
        this.renderer.draw();
    }
    
    jsi.table.InputTable.prototype.addCellTemplate = function(element, heading, leftText, rightText)
    {
        //given some new element to copy for the cell
        
        var col = this.newColumn(heading, heading.replace(/ /, "").toLowerCase());
        
        var cell = new jsi.table.Cell(col, element);
        
        cell.leftText = leftText;
        cell.rightText = rightText;
        
        this.cells.push(cell);
    }
    
    jsi.table.InputTable.prototype.setFooter = function(text)
    {
        var anchorText = text;
        
        if (text == null)
        {
            anchorText = "&#0187; Add Another Range";
        }
        
        var anchor = jsi.dhtml.createElement("a");
        anchor.setAttribute("onclick","jsi.table.getTable("+this.id+").insertRow();");
	    anchor.setAttribute("href","javascript: void(0);");
	    anchor.setValue(anchorText);
	    
	    this.table.footing = anchor;
    }
    
    jsi.table.InputTable.prototype.insertRow = function(preloadData)
    {
        var row = this.newRow();
        
        for (var i in this.cells)
        {
            cellTemplate = this.cells[i];
            
            newCell = row.newCell(cellTemplate.column, cellTemplate.element.cloneNode(true));
            
            newCell.leftText = cellTemplate.leftText;
            
            newCell.rightText = cellTemplate.rightText;
            
            if (preloadData && preloadData[i] != null)
            {
                newCell.setValue(preloadData[i]);
            }
        }
        
        //draw the cell with the options
        span = jsi.dhtml.createElement("span");
       
        anchor = jsi.dhtml.createElement("a");
        anchor.setAttribute("onclick","jsi.table.getTable("+this.id+").updateAndInsertRow();");
        anchor.setAttribute("href","javascript: void(0);");
        anchor.appendChildElement(jsi.dhtml.createTextNode("OK"));
       
       
        span.appendChildElement(anchor);
       
        newCell = row.newCell(this.buttonColumn,span);
        
    }
    
    jsi.table.InputTable.prototype.deleteRow = function(rowIndex)
    {
        this.removeRow(rowIndex);
        
        this.updateOutput();
           
        this.draw();
    }
    
    //get all template cells inside this element
    jsi.table.InputTable.prototype.loadTemplates = function(element)
    {
        var nodes = element.getChildNodes();
        
        for (var i in nodes)
        {
            if (nodes[i].hasAttributes() && nodes[i].getAttribute("jsi_template") == "true")
            {
                newInputTemplate = jsi.dhtml.createElement("input");
                
                attrs = nodes[i].getAttributes();
                
                for (var x in attrs)
                {
                    newInputTemplate.setAttribute(attrs[x].name,attrs[x].value);
                }
                
                this.addCellTemplate(newInputTemplate,nodes[i].getAttribute("jsi_template_heading"),nodes[i].getAttribute("jsi_template_lefttext"),nodes[i].getAttribute("jsi_template_righttext"));
            }
        
        }
        
    }
    
    jsi.table.InputTable.prototype.updateRow = function()
    {
        //make the previous row all readonly 
        lastRow = this.getLastRow();
        
        allCells = lastRow.getCells();
        
        for (var x in allCells)
        {
            aCell = allCells[x];
            
            if (aCell.isFormInput())
            {
                aCell.element.setReadonly(true);
                aCell.element.setColour("gray");
            }
        
        }
        
        //change the cell of the previous row
        span = jsi.dhtml.createElement("span");
       
        anchor = jsi.dhtml.createElement("a");
        anchor.setAttribute("onclick","jsi.table.getTable("+this.id+").deleteRow(" + lastRow.index + ");");
        anchor.setAttribute("href","javascript: void(0);");
        anchor.appendChildElement(jsi.dhtml.createTextNode("Del"));
       
        span.appendChildElement(anchor);
       
        newCell = lastRow.newCell(this.buttonColumn,span);
        
        this.updateOutput();
        
        
    }
    
    jsi.table.InputTable.prototype.updateAndInsertRow = function()
    {
        this.updateRow();
        
        this.insertRow();
        
        this.draw();
    }
    
    jsi.table.InputTable.prototype.updateOutput = function()
    {
        this.renderer.updateInput();
        
        this.outputElement.setValue(this.getAsXML(this.columns.slice(0,this.columns.length-1), true));
    }
