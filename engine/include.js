////////////////////////////////////////////////////////////////////////////
/*
    include.js

    Main loading code for EngineJS, this loader ensures all the dependencies are loaded
    in the correct order based on the package file.

   
*/
////////////////////////////////////////////////////////////////////////////
include.config = {
    verbose:true,
    strict:false,
    devmode:true,
    paths:{},
    indent:""
}

////////////////////////////////////////////////////////////////////////////
/*
    loadJSON

    Retreives the package JSON file from ther server.

    Parameters 
        fnJSON : The name of the package to load.
        callback : A function that will be called once the package is loaded
*/
////////////////////////////////////////////////////////////////////////////

function loadJSON(fnJSON,callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', fnJSON, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            var data = JSON.parse(xobj.responseText);
            callback(data);
          }
    };
    xobj.send(null);  
 }


////////////////////////////////////////////////////////////////////////////
/*
    INCLUDE

    Include is a very simple script loader and includes your apps dependences.

    Parameters 
        script : Array of strings for each script you want to load.
        callback : A function that will be called once all the scripts are loaded

    Config
        verbose : Report in the console window the name of each script loaded
        strict  : Controls how INCLUDE handles load errors (404 not found), 
                  with strict set to true the loading process will stop other it will
                  just report the error.
        devmode : Adds a querystring with a unique number to force a fresh of the file.
        paths   : A group of keys for source paths internal use only
        indent  : A string that indents the verbose output depending on the JSON struture. Internal user only
*/
////////////////////////////////////////////////////////////////////////////

function include(scripts, callback)
{
    var loaded = 0;
    if (typeof scripts == "string") return;
    var fnLoaded =  function()
    {
        loaded++;
        if (loaded == scripts.length && callback) callback();
    }
    var fnLoadError = function(oError)
    {
        console.log(include.config.indent + "The script " + oError.target.src + " is not accessible.");
        if (!include.config.strict)
        {
            loaded++;
            if (loaded == scripts.length && callback) callback();                
        }
    }

    var head = document.getElementsByTagName('head')[0];
    for(index in scripts)
    {
        var url = scripts[index];
        
        if (!url)  continue; 

        for (var key in include.config.paths) 
        {
            if (include.config.paths.hasOwnProperty(key)) 
            {
                var path = include.config.paths[key];
                url = url.replace("{"+key+"}",path);
            }
        }


        if (url.indexOf(".css") != -1)
        {
            var script = document.createElement('link');
            script.type = 'text/css';
            script.rel = 'stylesheet'; 
            if (include.config.devmode)
                url += "?refresh=" + Date.now();
            script.href = url;       
        }
        else
        {
            // Adding the script tag to the head as suggested before
            var script = document.createElement('script');
            script.type = 'text/javascript';
            if (url.indexOf(".js") == -1) url += ".js";
            if (include.config.devmode)
                url += "?refresh=" + Date.now();
            if (!include.config.devmode)
                script.src = "./production.php?js=" + url;
            else
                script.src = url;
        }    
        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = fnLoaded;
        script.onload = fnLoaded;
        script.onerror  = fnLoadError;

        if (include.config.verbose)
        {
            if (url.indexOf(".css") != -1)
                console.log(include.config.indent + "loading CSS:" + script.href);
            else
                console.log(include.config.indent + "loading CODE:" + script.src);
        }

        // Fire the loading
        head.appendChild(script);
    }
}

////////////////////////////////////////////////////////////////////////////
/*
    loader

    Used the include file to load the application dependencies in the right order.

    Parameters 
        package : A JSON object containing the package details
        paths : Option JSON object with key paths
*/
////////////////////////////////////////////////////////////////////////////
function loader(package,paths)
{
    var scripts = [];

    if (include.config.verbose)
    {
        console.log(include.config.indent + "=============================================");
        if ( package.name )
             console.log(include.config.indent + "loading script for " + package.name);
        else
            console.log(include.config.indent + "loading scripts");
    }
    if (paths)
    {
        include.config.paths = paths;
    }
    for (var key in package) {
        if (package.hasOwnProperty(key)) {
            // Ignore element whose hane begins with a '!' character.
            if (typeof key == "string" && key.substr(0,1) == "!")
                continue;
            var element = package[key];
            if (typeof element == "object")
                scripts.push(element);
        }
    }
    function load(index)
    {
        if (index == scripts.length) return;
        if (package.production)
        {
            include.config.devmode = false;
        }
        if (!Array.isArray(scripts[index]))
        {
            loader(scripts[index]);
            load(index+1);
        }
        else 
            include(scripts[index],function()
            {
                load(index+1);
            });
        include.config.devmode = true; 
    }
    include.config.indent += "    ";
    load(0);  
    include.config.indent = include.config.indent.substr(0,include.config.indent.length-4);
}
