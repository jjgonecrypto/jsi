jsi.test.tests = new Array();

jsi.test.addTest = function(name, fnc)
{
    jsi.test.tests.push(new jsi.test.Test(name, fnc));
}

jsi.test.begin = function(outputElement)
{
    if (!jsi.dhtml.isLoaded)
    {
        throw("Dhtml package must be loaded to start testing.");
    }
    
    var result = "";
    
    outputElement.setValue(result);
    
    for (var i in jsi.test.tests)
    {
        jsi.test.tests[i].run();
        
        if (jsi.test.tests[i].status == true)
        {
            result = "Test "+i+" : <span style='color: green'>PASSED</span> [" + jsi.test.tests[i].name + "]";
        }
        else
        {
            result = "Test "+i+" : <span style='color: red'>FAILED</span> [" + jsi.test.tests[i].name + "]";
        }
        
        result += "<br>";
        
        outputElement.setValue(outputElement.getValue() + result);
    }
    
}

jsi.test.Test = function(name, exeFnc)
{
    this.name = name;
    
    this.status = null;
    
    this.execute = exeFnc;    
}

jsi.test.Test.prototype.run = function()
{
    this.status = this.execute.call();
}

