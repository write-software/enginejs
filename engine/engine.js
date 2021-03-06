/****************************************************************
 *
 * The author of this software is Steve Egginton.
 *
 * Copyright (c) 2018,2019 The Write Software Company Limited.
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose without fee is hereby granted, provided that this entire notice
 * is included in all copies of any software which is or includes a copy
 * or modification of this software and in all copies of the supporting
 * documentation for such software.
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, NEITHER THE AUTHOR NOR WRITE SOFTWARE MAKES ANY
 * REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 *
 ***************************************************************/
 ////////////////////////////////////////////////////////////////////////////
/*
    engine.js

    Code for EngineJS, this class based framework is based on MVC a architecture.

    version:    1.0.0
   
*/
////////////////////////////////////////////////////////////////////////////

//------------------------------------------------------------------------------
// Private gloval vars

let _ready;
window._appName = "EngineJS";

////////////////////////////////////////////////////////////////////////////
/*
    _core

    This global object is not accessed directly but helps EngineJS keep a track
    of all create objects.
    
*/
////////////////////////////////////////////////////////////////////////////
window._core = {    
    app:null,
    routers:{},
    components:{},
    models:{},
    elements:{},
    constants:{},
    agent:navigator.userAgent.toLowerCase(),
    log:function(x)
    {
        console.log(x);
    },
    attachComponent:function(name,_component)
    {
        if (!_component instanceof component) 
        {
            this.log("WARNING: attachComponent() parameter not of class component");
            return;
        }
        try
        {
            this.components[name]  = _component;
        }
        catch(e)
        {
        }        
    },
    attachModel:function(name,_model)
    {
        if (!_model instanceof model) 
        {
            this.log("WARNING: attachModel() parameter not of class model");
            return;
        }
        try
        {
            this.models[name]  = _model;
        }
        catch(e)
        {
        }        
    },
    attachConstants:function(name,_constant)
    {
        if (typeof _constant != "string") 
        {
            this.log("WARNING: attachConstants() parameter not of type string / Const");
            return;
        }
        try
        {
            this.constants[name]  = _constant;
        }
        catch(e)
        {
        }        
    },
    attachRouter:function(name,_router)
    {
        if (!_router instanceof router) 
        {
            this.log("WARNING: attachRouter() parameter not of class router");
            return;
        }
        try
        {
            this.routers[name]  = _router;
        }
        catch(e)
        {
        }        
    },
    isModel:function(name)
    {
        return this.models[name] == null ? false : true;
    },
    isComponent:function(name)
    {
        return this.components[name] == null ? false : true;
    },
    isConstant:function(name)
    {
        return this.constants[name] == null ? false : true;
    },
    isElements:function(name)
    {
        return this.elements[name] == null ? false : true;
    },
    isRouter:function(name)
    {
        return this.routers[name] == null ? false : true;
    },
    isMobile : function() 
    {
        if (this.agent.indexOf("ipad") != -1) return true;
        if (this.agent.indexOf("iphone") != -1) return true;
        if (this.agent.indexOf("android") != -1) return true;
        if (this.agent.indexOf("iemobile") != -1) return true;
        if (this.agent.indexOf("blackberry") != -1) return true;
        return false;
    },
    isStandAlone : function() { return window.navigator.standalone; }
};

////////////////////////////////////////////////////////////////////////////
/*
    loadScript

    Global function to dynamically load script
    
    Parameters 
        url : The name of script file to load.
        callback : A function that will be called once the script is loaded
*/
////////////////////////////////////////////////////////////////////////////
function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}
////////////////////////////////////////////////////////////////////////////
/*
    loadModule

    Global function to dynamically load script as a module
    
    Parameters 
        url : The name of script file to load.
        callback : A function that will be called once the script is loaded
*/
////////////////////////////////////////////////////////////////////////////
function loadModule(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'module';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = function()
    {
        callback(script);
    }
    script.onload = function()
    {
        callback(script);
    }
    // Fire the loading
    head.appendChild(script);
}

////////////////////////////////////////////////////////////////////////////
/*
    _import

    Global function to dynamically load script files
    
    Parameters 
        scripts : An array of script files to be loaded.
        callback : A function that will be called once all the script files are loaded
*/
////////////////////////////////////////////////////////////////////////////
function _import(scripts,callback) {
    let loaded = 0;
    for(script in scripts)
    {
        $.ajax({
            url: script,
            dataType: "script",
            success: function () {
                loaded++
                if (loaded == scripts.length && callback) callback();
            },
            error: function () {
                throw new Error("Could not load script " + script);
            }
        });    
    }
}
///////////////////////////////////////////////////////////////////////////////
/*
    Class object

    Global EngineJS class factory.
    
*/
////////////////////////////////////////////////////////////////////////////
(function()
{
    var initializing = false;

    // The base Class implementation (does nothing)
    this.Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop)
    {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop)
        {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" ?
            (function(name, fn)
            {
                return function()
                {
                    var tmp = this._super;

                    // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = _super[name];

                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
        }
        // The dummy class constructor
        function Class()
        {
            // All construction is actually done in the init method
            if ( !initializing && this.init )
                this.init.apply(this, arguments);
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };
})();

///////////////////////////////////////////////////////////////////////////////
//  Engine JS base class object
var enObject = Class.extend({});

//------------------------------------------------------------------------------
// Helpers

String.prototype.replaceAll = function(strReplace, strWith)
{
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};

String.prototype.indexOfWord = function(searchText)
{
    searchText = searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    let res = this.match(new RegExp("\\b" + searchText + "\\b", "i"));
    return res == null ? -1 : res.index;
}

if (!String.prototype.trim) 
{
  String.prototype.trim = function () 
  {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

if (typeof JSON.clone !== "function") {
    JSON.clone = function(obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}


//------------------------------------------------------------------------------
// Macros

$debug = function(x) { try { if (console) console.log(x);}catch(e){} };
$copy = function(x) {  return x.slice(0); };
$log = function(x) { try { if (console) console.log(x);}catch(e){} };
$delay = function(t,f,s) { return setTimeout(function(){ f(s); },t); };
$ft = function(v) { if (v == "") return 0; if (v == null) return 0; return parseFloat(v); };
$round = function(num,dec) { return Math.round(num*Math.pow(10,dec))/Math.pow(10,dec); };
$int = function(num) { return Math.round(num*Math.pow(10,0))/Math.pow(10,0); };
$random = function(min,max) { return Math.floor(Math.random()*(max-min+1)+min); };
$ucwords = function (s) { return s.replace(/\b[a-z](?=[a-z])/g, function(txt){return txt.charAt(0).toUpperCase();}); };
$ellipsis = function (text,l)  {  text += "...";  while (text.length > chars && text.substr(text.length-3,1) != " ") { text = text.substr(0,text.length-4) + "..."; } return  text; };

///////////////////////////////////////////////////////////////////////////////
/*
    Event Class

    A private class used by EngineJS to fire events between the model, view and
    controller.
    
*/
////////////////////////////////////////////////////////////////////////////
var _event = Class.extend({
    init:function(config)
    {
        this._sender = config.sender;
        this._listeners = [];
    },
    attach:function(listener)
    {
        if (this._listeners.indexOf(listener) == -1)
            this._listeners.push(listener);
    },
    notify:function(args)
    {
        this._listeners.forEach(
            (v, i) => this._listeners[i](this._sender, args)
        )
    }
});

///////////////////////////////////////////////////////////////////////////////
/*
    Application Event Class

    A global class to allow developers to handle application specific events.
    These are not DOM based events but events that happen as the app is used.
    
    Example
    
    The event of a user signing in, that you may wish to intercept depending on
    the user profile.
    
*/
////////////////////////////////////////////////////////////////////////////
var appEvents = Class.extend({
    init:function()
    {
        this.events = [];
        this.halt = false;
    },
    register:function(sEvent,fn)
    {
        if (this.events[sEvent] == null)
        {
            this.events[sEvent] = []
        }
        this.events[sEvent].push(fn);
        return this.events[sEvent].length-1;
    },
    unregister:function(sEvent,idx)
    {
        if (idx == null) return;
        this.events[sEvent].splice(idx,1);
    },
    stop:function()
    {
        this.halt = true;
    },
    isStopped:function()
    {
        return this.halt;   
    },
    fire:function(sEvent, data , callback)
    {
        var me = this;
        this.halt = false;
        if (this.events[sEvent] == null) 
        {
            try{
                if (callback) callback();
            }
            catch(e)
            {
            }                        
            return !this.halt;
        }
        var ret;
            
        jQuery.each(this.events[sEvent],function(index,fn)
        {
            if (this.halt) return;
            try
            {
                ret = fn.call(me,data, callback);
            }
            catch(e)
            {
                $debug(e.message);
            }                        
        });
        if (ret != null) return ret;
        return !this.halt;
    }
});

///////////////////////////////////////////////////////////////////////////////
/*
    Base Class

    A private class from which the models, views and controllers are derived.
    
    This class contains a standard set of functions useful to any class object.
    
*/
////////////////////////////////////////////////////////////////////////////
var baseClass = Class.extend({
    init:function()
    {

    },
    log:function(x)
    {
        debugger;
        console.log(x);
    },
    hasClass:function(el, className)
    {
        if (el.classList)
            return el.classList.contains(className)
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    },
    addClass:function(el, className)
    {
        if (el.classList)
            el.classList.add(className)
        else if (!hasClass(el, className)) el.className += " " + className
    },
    removeClass:function(el, className)
    {
        if (el.classList)
            el.classList.remove(className)
        else if (hasClass(el, className))
        {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className = el.className.replace(reg, ' ')
        }
    },
    addEvent:function(element, type, handler)
    {
        element.addEventListener(type, handler);
    },
    query:function(selector)
    {
        return $(selector);
    },
    warning:function(sWarning)
    {
        try
        {
            console.log("WARNING:" + sWarning + " in '" + this.as + "'");
        }
        catch (e)
        {}
    },
    guid:function()
    {
        var sGUID = new Date().toISOString();
        sGUID = sGUID.replaceAll("-", "");
        sGUID = sGUID.replaceAll(":", "");
        sGUID = sGUID.replaceAll("T", "");
        sGUID = sGUID.replaceAll("Z", "");
        sGUID = sGUID.replaceAll(".", "_");
        return sGUID;
    },
    urldecode:function(str)
    {
        try
        {
            return decodeURIComponent((str + '').replace(/\+/g, '%20'));
        }
        catch (e)
        {
            return str;
        }
    },
    urlencode:function(str)
    {
        try
        {
            return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
        }
        catch (e)
        {
            return str;
        }
    },
    trim:function(str, chars)
    {
        if (str == null || typeof str != "string") return str;
        return this.ltrim(this.rtrim(str, chars), chars);
    },
    ltrim:function(str, chars)
    {
        if (str == null || typeof str != "string") return str;
        chars = chars || "\\s";
        return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
    },
    rtrim:function(str, chars)
    {
        if (str == null || typeof str != "string") return str;
        chars = chars || "\\s";
        return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
    },
    padl:function(text, width, padding)
    {
        if (padding == null) padding = " ";
        if (padding == "") return text;
        if (!width) return text;
        return (width <= text.length) ? text : str_pad(padding + text, width, padding,'STR_PAD_LEFT');
    },
    padr:function(text, width, padding)
    {
        if (padding == null) padding = " ";
        if (padding == "") return string;
        if (!width) return text;
        return (width <= text.length) ? text : str_pad(padding + text, width, padding,'STR_PAD_RIGHT');
    },
    toPromise:function(cb)
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                var args = Array.prototype.slice.call(arguments, 1);
                cb.apply(null, args);
                resolve();
            }
            catch (e)
            {
                reject(e);
            }
        });
    },
    localSupport : function()
    {
        if (localStorage)
            return true;
        else
            return false;
    },
    storeLocal : function(key,value)
    {
        if (!this.localSupport()) return false;
        if (typeof value == "object")
            localStorage.setItem(key,JSON.stringify(value));
        else
            localStorage.setItem(key,value);
        return true;
    },
    removeLocal : function(key)
    {
        if (!this.localSupport()) return false;
        localStorage.removeItem(key);
        return true;
    },
    countLocal : function()
    {
        if (!this.localSupport()) return 0;
        return localStorage.length;
    },
    clearLocal : function()
    {
        if (!this.localSupport()) return false;
        localStorage.clear();
        return true;
    },
    getLocal : function(key,vDefault)
    {
        if (!this.localSupport()) return vDefault;
        var value = localStorage.getItem(key);
        if (typeof value == "string")
        {
            if (value.indexOf("{") == 0 || value.indexOf("[") == 0)
                value = JSON.parse(value);
        }
        return value == null ? vDefault : value;
    },
    queryString:function()
    {
        var decodeEntities = function(encodedString) {
            encodedString = encodedString.replaceAll("%20"," ");
            encodedString = encodedString.replaceAll("&amp;","&");
            return encodedString;
        }        
        let url = String(window.location).replace(window.location.hash,"");
        let parameters = new Array();
        if (url.indexOf("?") > 0)
        {
            var p = url.indexOf("?");
            var sQuery = url.substr(p+1);
            url =  url.substr(0,p);
            var a = sQuery.split("&");

            for (var i in a)
            {
                if (typeof a[i] != "string") break;
                var b = a[i].split("=")
                parameters[b[0]] = decodeEntities(b[1]);
            }
        }
        return parameters;
    },    
    clone:function(obj)
    {
        return $.extend({},obj);
    },
    ucwords:function(str)
    {
        return (str + '').replace(/^(.)|\s(.)/g, function ($1) {
            return $1.toUpperCase();    });
    }
});

////////////////////////////////////////////////////////////////////////////
/*
    MODEL class

    Main model class and responsible for manipulaing the data. This class is
    normally used as part of a MVC component but can be used independently.
    
    Parameters 
        data :    Main data as a JSON object.
        options : A JSON object set of model control options
        
        options = {
            autoStore: false,   // When true the data in this model is automatically stored to the localstore.
                                // likewise if data already exists the model will be initialised with it. 
            methods: {          // this optional property add custom methods to tbe model instance
            }
        }
*/
////////////////////////////////////////////////////////////////////////////
var model = baseClass.extend({
    init:function(data,options = {})
    {
        this._super();
        var _self = this;
        this.name = options.name || this.guid();
        this._data = data;
        this.autoStore = options.autoStore || false;     
        if (typeof this._data == "function") 
        {
            try
            {
                this._data = this._data.call(this);
            }
            catch(e)
            {
                this.log("WARNING: data method call failed " + e.message);  
            }
        }
        this.onChange = new _event( {sender:this} );
        if (typeof options.methods == "object")
        {
            for (var key in options.methods) 
            {
                var reserved = ["_attachController","storeNow","notify","getData","setData","applyJSON","set","put","remove","get","asString"];
                if (reserved.indexOf(key) == -1)
                    this[key] = options.methods[key];
                else
                    this.log("WARNING: method matched reserved name");
            };
        }
        if ( _core ) 
        {
            _core.attachModel(this.name,this);
        } 
        if (this.autoStore)
        {
            this.readNow();
        }
        if (this.oninit) this.oninit.call(this);
    },
    _attachController:function(controller,property)
    {
        this._controller = controller;
    },
    // Stubbs
    ondatachange:function(prop,value)
    {

    },
    // End Stubbs
    storeNow:function()
    {
        // Store the model data in local storage
        this.storeData(this.name,this._data);
    },
    readNow:function(cb)
    {
        // Read the model data in local data storage
        var d;
        var _self = this;
        if (reach)
        {
            reach.restoreData(this.name,function(d)
            {
                if (d)
                {
                    _self._data = $.extend(_self._data,d);
                    _self.notify();
                }
                cb && cb();
            },this._data)
        }
        else
        { 
            d = this.getLocal(this.name,this._data)
            if (d)
                this._data = $.extend(this._data,d);
        }
    },
    notify:function(_prop = "")
    {
        // Send notification to all components that the model has changed
        this.onChange.notify( { data:this._data,prop:_prop,value:""});
    },
    getData:function()
    {
        // get the whole model data
        return this._data;
    },
    setData:function(data,updateBinds = true)
    {
        // set the whole model data
        this._data = data;
        if (updateBinds) this.onChange.notify( { data:this._data,prop:"data",value:data});
        if (this.autoStore)
            this.storeData(this.name,this._data);
        this.ondatachange("data",data);
    },
    get:function(prop)
    {
        if (prop.substr(0, 2) != "$.") prop = "$." + prop;
        var result = jsonPath(this._data, prop);
        if (result.length == 1)
            return result[0];
        return result;
    },
    //---------------------------------------------------------------------------
    // SET is used to set the value of a model property and apply binding update
    set:function(prop, value, updateBinds = true, force = false)
    {
        let obj = this._data;
        let propname = prop;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            if (obj[element] == null) 
            {
                prop = prop.substr(p + 1);
                if (prop.indexOf(".") == -1) 
                {
                    obj[element] = {};
                    obj = obj[element];
                    break;
                }
                this.log("json path error "+propname);
                return;
            }
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (prop.substr(0,1) >= '0' && prop.substr(0,1) <= '9') prop = "_"+prop;
        var oldvalue = obj[prop];
        obj[prop] = value;
        if ((updateBinds && oldvalue != value) || force) this.onChange.notify( { data:this._data,prop:propname,value:value});
        if (this.autoStore)
            this.storeData(this.name,this._data);
        this.ondatachange(propname,value);
    },
    //---------------------------------------------------------------------------
    // PUT is like set but with not binding update
    put:function(prop, value)
    {
        let obj = this._data;
        let propname = prop;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            if (obj[element] == null) 
            {
                prop = prop.substr(p + 1);
                if (prop.indexOf(".") == -1) 
                {
                    obj[element] = {};
                    obj = obj[element];
                    break;
                }
                this.log("json path error "+propname);
                return;
            }
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (prop.substr(0,1) >= '0' && prop.substr(0,1) <= '9') prop = "_"+prop;
        var oldvalue = obj[prop];
        obj[prop] = value;
        if (this.autoStore)
            this.storeData(this.name,this._data);
        this.ondatachange(propname,value);
    },
    //---------------------------------------------------------------------------
    // REMOVE is used to remove a single model property and apply binding update
    remove:function(prop, updateBinds = true)
    {
        let obj = this._data;
        let propname = prop;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            if (obj[element] == null) 
            {
                prop = prop.substr(p + 1);
                if (prop.indexOf(".") == -1) 
                {
                    obj[element] = {};
                    obj = obj[element];
                    break;
                }
                this.log("json path error "+propname);
                return;
            }
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (prop.substr(0,1) >= '0' && prop.substr(0,1) <= '9') prop = "_"+prop;
        delete obj[prop];
        if (updateBinds) this.onChange.notify( { data:this._data,prop:propname,value:null});
        if (this.autoStore)
            this.storeData(this.name,this._data);
        this.ondatachange(propname,null);
    },
    applyJSON:function(json,_exclude = "", prop = "", updateBinds = true)
    {
        if (typeof json != "object") return;
        for (var key in json) 
        {
            if (_exclude )
            {
                if (_exclude.indexOfWord(key) == -1 && !prop)
                    this._data[key] = json[key];
                else if (_exclude.indexOfWord(key) == -1 && prop)
                    this._data[prop][key] = json[key];
            }
            else if (!prop)
                this._data[key] = json[key];
            else
                this._data[prop][key] = json[key];
        }   
        if (updateBinds && this._controller) this._controller.refreshData()     
    },
    push:function(prop, value, updateBinds = true)
    {
        let obj = this._data;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (!$.isArray(obj[prop])) return;
        obj[prop].push(value);
        if (updateBinds)
            this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeData(this.name,this._data)
        this.ondatachange(prop,value);
    },
    pushTop:function(prop, value, updateBinds = true)
    {
        let obj = this._data;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (!$.isArray(obj[prop])) return;
        obj[prop].unshift(value);
        if (updateBinds)
            this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeData(this.name,this._data)
        this.ondatachange(prop,value);
    },
    pop:function(prop, updateBinds = true)
    {
        let obj = this._data;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (!$.isArray(obj[prop])) return;
        var value = obj[prop].pop();
        if (updateBinds)
            this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeData(this.name,this._data)
        this.ondatachange(prop);
        return value;
    },
    getAt:function(prop,index)
    {
        let obj = this._data;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (!$.isArray(obj[prop])) return null;
        return obj[prop][index];
    },
    setAt:function(prop,index,value, updateBinds = true)
    {
        let obj = this._data;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (!$.isArray(obj[prop])) return null;
        obj[prop][index] = value;
        if (updateBinds)
            this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeData(this.name,this._data)
        this.ondatachange(prop);
    },
    removeAt:function(prop,index, updateBinds = true)
    {
        let obj = this._data;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (!$.isArray(obj[prop])) return;
        var value = obj[prop].splice(index,1);
        if (updateBinds)
            this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeData(this.name,this._data)
        this.ondatachange(prop);
        return value;
    },
    insertAt:function(prop,index,value, updateBinds = true)
    {
        let obj = this._data;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        if (!$.isArray(obj[prop])) return;
        obj[prop].splice(index,0,value);
        if (updateBinds)
            this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeData(this.name,this._data)
        this.ondatachange(prop,value,index);
    },
    asString:function()
    {
        return JSON.stringify (this._data);
    },
    search:function(_prop,_key,_value,casesensitive = false)
    {
        var d = this._data[_prop];
        if (d)
        {
            try{
                for (var i = 0;i < d.length;i++)
                {
                    var e = d[i];
                    if (_key.indexOf(".") != -1)
                    {
                        var v = jsonPath(e, _key);
                        if (v) v = v[0];
                    }
                    else    
                        var v = e[_key];
                    if (!casesensitive)
                    {
                        if (v && v.toLowerCase() == _value.toLowerCase()) return i;
                    }
                    else
                    {
                        if (v && v == _value) return i;
                    }
                }
            }
            catch(e)
            {
                console.log("Search Failed:"+e.message);
            }
        }
        return -1;    
    },
    lookup:function(_prop,_key,_value,_return)
    {
        var d = this._data[_prop];
        if (d)
        {
            for (var i = 0;i < d.length;i++)
            {
                var e = d[i][_key];
                if (e && e == _value) return d[i][_return];;
            }
        }
        return -1;    
    },
    filter:function(_prop,fn)
    {
        var d = this._data[_prop];
        if (d) return d.filter(fn);
        return null
    },
    forEach:function(_prop,fn)
    {
        var d = this._data[_prop];
        if (d) d.forEach(fn);
    },
    sort:function(_prop,_key1,_key2,bNumeric1,bNumeric2)
    {
        function SortBy(a, b){
            var aV1 = jsonPath(a,_key1);
            var bV1 = jsonPath(b,_key1); 

            if (typeof aV1 == "string") aV1 = aV1.toLowerCase();
            if (typeof bV1 == "string") bV1 = bV1.toLowerCase();
            if (bNumeric1)
            {
                if (($ft(aV1) < $ft(bV1))) return -1;
                if (($ft(aV1) > $ft(bV1))) return 1;
            }
            else
            {
                if ((aV1 < bV1)) return -1;
                if ((aV1 > bV1)) return 1;
            }
            if (_key2)
            {
                var aV12= jsonPath(a,_key2);
                var bV2 = jsonPath(b,_key2); 
        
                if (typeof aV2 == "string") aV2 = aV2.toLowerCase();
                if (typeof bV2 == "string") bV2 = bV2.toLowerCase();
                if (bNumeric2)






                {
                    if (($ft(aV2) < $ft(bV2))) return -1;
                    if (($ft(aV2) > $ft(bV2))) return 1;


                }
                else



                {
                    if ((aV2 < bV2)) return -1;
                    if ((aV2 > bV2)) return 1;
                }
            }
            return 0;
          }
          var d = this._data[_prop];
        if (d)
        {
            d.sort(SortBy);
            this.onChange.notify( { data:this._data,prop:_prop,value:d});
            if (this.autoStore)
                this.storeData(this.name,this._data)
        }
    },
    storeData:function(name,data,cb)
    {
        if (reach)
        {
            reach.storeData(name,data,cb);
        }
        else
        {
            this.storeLocal(this.name,this._data)
            if (cb) cb();
        }
    }
});

////////////////////////////////////////////////////////////////////////////
/*
    VIEW class

    Main view class and responsible for visiual interaction. This class can be
    used either as hardcode HTML or HTML that is dynamically loaded.
    
    Parameters 
        html : Pure HTML to be rendered as the view.
        options : A JSON object set of view control options
        
        options = {
            url:""          // the url to view dynamic loaded HTML 
            methods: {      // this optional property add custom methods to tbe view instance
            }
        }
*/
////////////////////////////////////////////////////////////////////////////
var view = baseClass.extend({
    init:function(html = "", options = {})
    {
        this._super();
        this._options = options;
        this._template = "";
        this._url = "";
        if (options.url)
            this._url = options.url;
        else
            this._template = html;
        this.onChange = new _event( {sender:this} );
        if (typeof options.methods == "object")
        {
            for (var key in options.methods) 
            {
                var reserved = ["_attachController","buildView","loadView","removeTemplate",
                                "_observe","_compileHTML","_buildHTML","_applyValue","_binds",
                                "_applyConstants","_applyData","_compile","render"];
                if (reserved.indexOf(key) == -1)
                    this[key] = options.methods[key];
                else
                    this.log("WARNING: method matched reserved name");
            };
        }
    },
    _attachController:function(controller,property)
    {
        this._controller = controller;
    },
    buildView:function(html)
    {
        return $(this._compile(html));
    },
    loadView:function(url)
    {
        return new Promise((resolve, reject) =>
        {
            try
            {
                $.ajax(
                {
                    url: url,
                    success: function(html)
                    {
                        resolve(html);
                    },
                    error: function(jqXHR, errText, err)
                    {
                        reject(jqXHR, errText, err);
                    }
                });
            }
            catch (e)
            {
                reject(e);
            }
        });
    },
    _observe:function(element, event, attr)
    {
        var _self = this;
        $(element).on(event,
        {
            attr: attr
        }, function(ev)
        {
            if (ev.data.attr == "value")
            {
                let v = this.tagName == "INPUT" || this.tagName == "TEXTAREA" ? $(this).val() :  $(this).text();
                
                _self.onChange.notify(
                {
                    event: ev,
                    value: v
                })
            }
            if (ev.data.attr == "checked")
            {
                _self.onChange.notify(
                {
                    event: ev,
                    value: $(this).is(':checked') ? "Y"  : "N"
                })
            }
        });
    },
    _buildHTML:function(value,prop,el)
    {
        var _self = this;
        var selector = '[en-template="' + prop + '"]';
        var dataElement =  $(_self._element).children(selector);
        if (dataElement.length == 0 && el)
        {
            dataElement =  $(el).children(selector);  
        }
        var output = "";
        if (dataElement.length == 1)
        {
            var template = $(dataElement)[0].innerHTML;
            template = _self.trim(template);
            for(var index in value)
            {
                let entry = value[index];
                if (typeof entry == "object")
                {
                    var exp = /{\s*([^}]+)\s*}/g
                    var placeholders = template.match(exp);
                    var line = template;
                    for (let key in placeholders) 
                    {
                        if (placeholders.hasOwnProperty(key)) 
                        {
                            const placeholder = placeholders[key];
                            let marker = placeholder.replace("this", _self.id).replace("{", "").replace("}", "").trim();
                            if (marker == "{id}") continue;
                            var data = jsonPath(entry,marker);
                            line = line.replaceAll(placeholder,data[0]);   
                        }
                    }
                    line = line.replaceAll("{id}",_self.id + "_" + index);   
                    line = line.replaceAll("{index}",index);   
                    output += line;                
                }
                else
                {
                    template = template.replaceAll("{id}",_self.id + "_" + index);   
                    template = template.replaceAll("{index}",index);   
                    output += template.replaceAll("{text}",entry);                            
                }        
            }
        }
        else
        {
            if (typeof _self._controller.beforeDataRender == "function")
            {
                output += _self._controller.beforeDataRender() || "";
            }
            if (typeof _self._controller.dataRender == "function")
            {
                for(var index in value)
                {
                    let entry = value[index];
                    output += _self._controller.dataRender(entry,index)
                }
                if (output == "")
                {
                    if (typeof _self._controller.emptyRender == "function")
                    {
                        output = _self._controller.emptyRender();
                    }
                }
                if (typeof _self._controller.afterDataRender == "function")
                {
                    output += _self._controller.afterDataRender();
                }
            }
            else
                return null;
        }
        return output;
    },
    _compileHTML:function(html,data)
    {
        var _self = this;
        try{
            var template = Handlebars.compile(html);
            var html = template(data);    
        }
        catch(e)
        {
            $debug(e.message);
        };
        var exp = /{%\s*([^}]+)\s*%}/g
        var placeholders = html.match(exp);
        for (let key in placeholders) 
        {
            if (placeholders.hasOwnProperty(key)) 
            {
                const placeholder = placeholders[key];
                let marker = placeholder.replace("this", _self.id).replace("{%", "").replace("%}", "").trim();
                if ( marker.indexOf("(") != -1 && marker.indexOf(")") != -1)
                {
                    marker = "<span class='en-bind _" + marker + "' en-bind='" + marker + "'></span>";
                    html = html.replace(placeholder, marker);    
                }
                else
                {
                    dot = marker.indexOf(".");
                    if (dot != -1)
                    {
                        obj = marker.substr(0,dot);
                        sProp = marker.substr(dot+1);
                        if (_core.isModel(obj))
                            marker = "<span class='en-bind _" + sProp + "' en-model='" + obj + "' en-bind='" + sProp + "'></span>";
                        else
                            marker = "<span class='en-bind _" + marker + "' en-bind='" + marker + "'></span>";
                    }
                    else
                        marker = "<span class='en-bind _" + marker + "' en-bind='" + marker + "'></span>";
                    html = html.replace(placeholder, marker);    
                }
            }
        }
        var exp = /{=\s*([^}]+)\s*=}/g
        var placeholders = html.match(exp);
        var $scope = this.data;
        for (let key in placeholders) 
        {
            if (placeholders.hasOwnProperty(key)) 
            {
                const placeholder = placeholders[key];
                let marker = placeholder.replace("this", _self.id).replace("{=", "").replace("=}", "").trim();
                try
                {
                    let dot = marker.indexOf(".");
                    if (dot != -1)
                    {
                        let sObj = marker.substr(0,dot);
                        let sProp = marker.substr(dot+1);
                        if (_core.app.isAttachedModel(sObj))
                        {
                            marker = `_core.app.getModelData("${obj}").${sProp};`;
                        }
                        marker = eval(marker);
                    }
                    else
                    {
                        marker = eval(marker);
                    }
                }
                catch(e)
                {
                    marker = "";                    
                }
                html = html.replace(placeholder, marker);    
            }
        }
        return html;
    },
    _applyValue:function(el,value,attr)
    {
        var _self = this;
        var style = "";
        
        if (!attr)
            return;
        if (typeof value == "undefined")
        {
            debugger;
            _self.log("Undefined Value Passed to _applyValue");
            return;
        }
        if (typeof value == "string" && el.tagName == "DIV" && value.indexOf("<") == -1) //Ignore anything that looks like HTML
        {
            value = value.replaceAll("\n","<br/>");
        }

        var p = attr.indexOf(":");
        if (p != -1)
        {
            style = attr.substr(p+1);
            attr = attr.substr(0,p);
        }
        if (attr == "text" || attr == "string")
        {
            if (value.toString().indexOf("<") != -1 && value.toString().indexOf(">") != -1)
                $(el).html(value);
            else
                $(el).text(value);
        }
        else if (attr == "html")
        {
            if (typeof value == "object")
            {
                debugger;
                _self.log("Object Value Passed to _applyValue");
                return;
            }
            if (value.toString().indexOf("<") == -1)
                value = value.toString().replaceAll("\n","<br/>");
            $(el).html(value);
        }
        else if (attr == "number")
            $(el).text(value.toString());
        else if (attr == "value")
        {
            $(el).val(value);
        }
        else if (attr == "checked")
        {
            if (value == "Y")
                $(el).prop('checked',true);
            else
                $(el).prop('checked',false);
        }
        else if (attr == "css")
        {
            if (style == "background-image")
                value = "url('" + value + "')";
            $(el).css(style,value);
        }
        else
        {
            $(el).attr(attr,value);
        }
    },
    _binds:function(data,prop = "",value = "")
    {
        var _self = this;
        var selector = "[en-bind]";
        _self.data = data;
        if (prop != "")
            selector = '[en-bind*="' + prop + '"],[en-bind*="' + _self.id + "." + prop + '"]';

        return new Promise((resolve, reject) => {
            {
                if (!_self._element)
                {
                    return;
                }
                $(_self._element).find(selector).each(function(index, el)
                {
                    let sModel = $(el).attr("en-model") || "";
                    let sBind = $(el).attr("en-bind");
                    let sAttr = $(el).attr("en-attr") || "html";
                    let sProp = "";
                    let obj = "";
                    let dot = sBind.indexOf(".");
                    let value = "";

                    if (dot != -1)
                        sProp = sBind.substr(dot+1);
                    else
                        sProp = sBind;
                    if (sModel != "")
                        _self.model = _core.app.getModelData(sModel);
                    else
                        _self.model = _self.data;

                    if (sBind.indexOfWord("app.") != -1) sBind = sBind.replaceAll("app.","_core.app.");
                    if ( sBind.indexOf("(") == -1 && sBind.indexOf(")") == -1)
                    {
                        if (sBind.indexOfWord("_self.") != -1) sBind = sBind.replaceAll("_self.","_self.model.");
                    }
            
                    dot = sBind.indexOf(".");
                    if (dot != -1)
                    {
                        obj = sBind.substr(0,dot);
                        if (_self.model.hasOwnProperty(obj))
                        {
                            sBind = "_self.model." + sBind;
                        }
                        else
                        {
                            if (obj == "this")
                            {
                                sBind = sBind.replace("this","_self.model");
                            }
                            else if ( sBind.indexOf("(") != -1 && sBind.indexOf(")") != -1)
                            {   
                                if (sBind.indexOf("_self") != -1)
                                    sBind = sBind.replace("_self","_core.app.components."+_self.id);  
                            } 
                            else
                            {
                                if (_core.isModel(obj))
                                {
                                    _self.model = _core.app.getModelData(obj); 
                                    sBind = sBind.replace(obj+".","_self.model.");
                                }    
                            }   
                        }
                        try
                        {
                            value = eval(sBind);
                        }
                        catch(e)
                        {
                            value = "";                    
                        }
                    }
                    else
                    {
                        value = _self.model[sBind];
                    }
                    try
                    {
                        if ($.isArray(value))
                        {
                            value = _self._buildHTML(value,sProp,el);
                        }
                        if (value != null)
                        {
                            var outputElement = $(_self._element).find(`output[en-component="${_self.id}"]`); 
                            if (outputElement.length == 1)
                            {
                                _self._applyValue(outputElement,value,sAttr);
                            }
                            else
                            {
                                var outputElement = $(_self._element).find(`[en-output="${_self.id}"]`); 
                                if (outputElement.length == 1)
                                {
                                    _self._applyValue(outputElement,value,sAttr);
                                }
                                else
                                {                                    
                                    _self._applyValue(el,value,sAttr);
                                }
                            }
                            _self._controller.onupdatebind(sBind,value);
                        }
                        else if (obj)
                        {
                            try
                            {                                      
                                sProp = eval(obj+".dataUpdate");
                                if (sProp)
                                {
                                    value = _self.data[sProp];
                                    eval(obj+".select(value)");
                                }
                            }
                            catch(e)
                            {
                                value = "";                    
                            }                                
                        }
                    }
                    catch(e)
                    {
                        _self.log(e.message);
                    }
                });
                if ($(_self._element)[0].hasAttribute("en-bind")) 
                {
                    let sBind = $(_self._element).attr("en-bind");
                    let sAttr = $(_self._element).attr("en-attr") || "html";
                    let sProp = sBind.replace("this.","");

                    if (sProp == prop || prop == "")
                    {
                        let value = data[sProp];
                        if ($.isArray(value))
                        {
                            value = _self._buildHTML(value,sProp);
                        }
                        if (value != null)
                        {
                            var outputElement = $(_self._element).find("output"); 
                            if (outputElement.length == 1)
                                _self._applyValue(outputElement,value,sAttr)
                            else
                            {
                                var outputElement = $(_self._element).find(`[en-output="${_self.id}"]`); 
                                if (outputElement.length == 1)
                                {
                                    _self._applyValue(outputElement,value,sAttr);
                                }
                                else
                                {             
                                    _self._applyValue(_self._element,value,sAttr);
                                }
                            }
                         }
                         else if (sBind.indexOf("this") == 0)
                         {          
                            value = _self[prop];
                            if (value != null)
                                 _self._applyValue(_self._element,value,sAttr);
                         }
                    }
               }
               if (typeof _self._controller.afterBinds == "function")
               {
                   try
                   {
                        _self._controller.afterBinds();
                   }
                   catch(e)
                   {

                   }
               }
               _self._applyEvents();
               resolve();
            }
        });
    },
    _applyConstants:function(html)
    {
        $.each(_core.constants,function(key,value)
        {
            html = html.replaceAll("<"+key+"/>",value);    
            html = html.replaceAll("<"+key+"></"+key+">",value);    
            html = html.replaceAll("<"+key+">",value);    
        });
        return html;
    },
    _applyData:function(html,data)
    {
        $.each(data,function(key,value)
        {
            html = html.replaceAll("{{this." + key + "}}",value);
        });
        return html;        
    },
    _compile:function(data)
    {
        var _self = this;
        return new Promise((resolve, reject) => {
            try {
                let html;
                if (!_self._template)
                {
                    _self.loadView(_self._url).then(function(html)
                    {
                        _self._template = html;            
                        html = _self._applyConstants(html);
                        html = _self._compileHTML(html,data);
                        resolve(html);
                    });
                }
                else
                {
                    html = _self._applyConstants(_self._template);
                    html = _self._compileHTML(html,data);
                    resolve(html);
                }
            }
            catch (e) 
            {
                reject(e);
            }
        });
    },
    _applyEvents:function()
    {
        var _self = this;
        $(_self._element).find("[en-observe]").each(function(index, el)
        {
            var sObserve = $(el).attr('en-observe');
            _self._observe(el, 'change', sObserve);
        });           
        var events = ['en-click','en-dblclick','en-focus','en-blur'];
        for (const key in events) {
            if (events.hasOwnProperty(key)) {
                const event = events[key];
                $(_self._element).find("["+event+"]").each(function(index, el)
                {
                    var method = $(el).attr(event);
                    if (method.indexOf("." == -1) && method.indexOf("(" == -1))
                    {
                         method = `_core.app.fire('${_self.id}','${method}')`;
                    }
                    else if (method.indexOf("(" == -1))
                    {
                        method += "()";                   
                    }
                    $(el).attr(event.replace("en-","on"),method);
                    $(el).removeAttr(event);
                });            
                        
            }
        }
    },
    render:function(selector, data, id = "", append = false, replace = false)
    {
        let _self = this;
        _self.id = id;
        _self.data = data;
        return new Promise((resolve, reject) => {
            try
            {
                this._compile(data).then(function(html)
                {
                    _self._element = $(html);
                    if ( _self._element.length != 1)
                    {
                        if (id)
                            _self._element = $('<div id="' + id + '" class="component">' + html + '</div>');
                        else
                            _self._element = $('<div class="component">' + html + '</div>');
                    }
                    if (append)
                    {
                        $(selector).append(_self._element);
                        _self._binds(data);
                    }
                    else if (replace)
                    {
                        $(selector).replaceWith(_self._element);
                        _self._binds(data);
                    }
                    else
                    {
                        $(selector).html(_self._element);            
                        _self._binds(data);
                    }
                    $(_self._element).find("*").attr("en-component", _self.id);
                    resolve(_self._element);
                })
            }
            catch(e)
            {
                reject(e);
            }
        });
    },
    getElement:function()
    {
        return this._element;
    }
});

////////////////////////////////////////////////////////////////////////////
/*
    COMPONENT class

    Main component or controller class and responsible for binding the view and model together.
    
    Parameters 
        _model : Model to be used (MUST EXISTS)
        _view  : VIEW to be used (MUST EXISTS)
        options : A JSON object set of component control options
        
        options = {
            id:""           // ID of component if not provided one is generated. 
            methods: {      // this optional property add custom methods to tbe component instance
                // Overrides
                ondatachange
            }
        }
*/
////////////////////////////////////////////////////////////////////////////
component = baseClass.extend({
    init:function(_model, _view, options = {})
    {
        this._super();
        let _self = this;

        this._model = _model;
        this._view = _view;
        this.selector = '';
        this.options = options;
        this._id = options.id || this.guid();

        if (this._model == null)
            this._model = new model({ }, {  name:this._id });  

        if (this._view == null)
            this._view = new view("", {  name:this._id });   
        else if (typeof _view == "string")                     
            this._view = new view(_view, {  name:this._id });  

        // attach this component to the main app so it available globally
        if ( _core ) 
            _core.attachComponent(this._id,this);
        else
        {
            alert("_Core Object Not Created")
        }
        // Create a callback on any change to the data model
        this._model.onChange.attach(
            (sender, arg) =>
            {
                _self._view._binds(arg.data,arg.prop,arg.value);
                /*
                try
                {
                    $('select:not(.ms)').selectpicker('refresh');
                }
                catch(e)
                {
                }
                */
                if (_self._ondatachange) 
                {
                    _self._ondatachange.call(_self,arg.prop,arg.value,arg.data);
                }
                if (_self.ondatachange) 
                {
                    _self.ondatachange.call(_self,arg.prop,arg.value,arg.data);
                }
            }
        );
        // Create a callback on any change to the view
        this._view.onChange.attach(
            (sender, data) =>
            {
                let el = data.event.target;
                let sProp = $(el).attr("en-bind");
                let m = $(el).attr("en-model");

                if (m)
                {
                    let model = $engine.getModel(m);
                    if (model)
                        model.set(sProp, data.value);
                }
                else
                    _self._model.set(sProp, data.value);
                if (_self.onchange) 
                    _self.onchange.call(_self,sProp, data);
            }
        );
        // Add any dynamic methods to this object
        if (typeof options.methods == "object")
        {
            for (var key in options.methods) 
            {
                var reserved = ["render","update"];
                if (reserved.indexOf(key) == -1)
                    this[key] = options.methods[key];
                else
                    this.log("WARNING: method matched reserved name");
            };
        }
        // Attach the controller to tbe view and model
        this._view._attachController(this);
        this._model._attachController(this);
        if (typeof this.oninit == "function")
            this.oninit();
    },
    components:function()
    {
        var _self = this;
        return new Promise((resolve, reject) => {
            try
            {
                $.each(_core.components,function(name,value)
                {
                    if (name == _self._id) return;
                    let comp = _core.components[name];
                    var el = $(_self._view._element).find(name); 
                    $(el).each(function(index)
                    {
                        $(el[index].attributes).each(function(idx,attr)
                        {
                            comp.getModel().set(attr.name,attr.value);
                        });
                        comp.render(el[index],false,false);   
                    });
                });
                resolve();
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    },
    elements:function()
    {
        var _self = this;
        return new Promise((resolve, reject) => {
            try
            {
                $.each(_core.elements,function(name,value)
                {
                    if (name == _self._id) return;
                    let element = _core.elements[name];
                    var el = $(_self._view._element).find(name); 
                    $(el).each(function(index)
                    {
                        var comp = $engine.createComponent(element.model,element.view,element.options);
                        $(el[index].attributes).each(function(idx,attr)
                        {
                            comp.getModel().set(attr.name,attr.value);
                        });
                        $engine.attachComponent(name+"_"+index,comp);
                        comp.render(el[index],false,false);   
                    });
                });
                resolve();
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    },
    compile:function(sHTML,data)
    {
        return this._view._compileHTML(sHTML,data);
    },
    render:function(selector,bAppend = false, bReplace = false)
    {
        let _self = this;
        _self.selector = selector
        return new Promise((resolve, reject) => {
            try
            {
                if ( _self.onbeforerender)
                    _self.onbeforerender.call(_self);
                this._view.render(selector,this._model._data,this._id,bAppend,bReplace)
                    .then(function(element)
                    {
                        _self.components().then(function()
                        {
                            // Make sure inherited components call parent;
                            try{
                               _self._onrender(element);
                            }
                            catch(e)
                            {
                                debugger;
                            }
                            if ( _self.onrender)
                                _self.onrender.call(_self,element);
                            _self.elements();
                            resolve(element);
                        });
                    });
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    },
    //--------------------------------------------------------------------------
    // Overrides
    _onrender:function()
    {   
        // Internal onrender for inherited components 
    },
    _ondatachange:function()
    {   
        // Internal ondatachange for inherited components 
    },
    onupdatebind:function(sBind,value)
    {
    },
    ondatachange:function()
    {
    
    },
    //--------------------------------------------------------------------------
    update:function(data)
    {
        this._model.set(data);
    },
    focus:function(name)
    {
        $("#" + this._id + "-"+name).focus();
    },
    focusFirst:function(name)
    {
        $(this._view._element).find('input:text:visible:first').focus();
    },
    refreshEvents:function()
    {
        this._view._applyEvents();
    },
    refreshData:function()
    {
        this._view._binds(this._model._data);
    },
    fire:function(_method)
    {
        var _self = this;
        return new Promise((resolve, reject) => {
            try
            {
                var args = Array.prototype.slice.call(arguments, 1);

                if (_self[_method]) _self[_method].apply(_self,args);
                resolve();
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    },
    getModel:function()
    {
        return this._model;
    },
    getContainer:function()
    {
        return this._view._element;
    },
    //--------------------------------------------------------------------
    // This method allows dynamic binding elements post render
    observe:function(selector)
    {
        var _self = this;
        $(this._view._element).find(selector).each(function(index, el)
        {
            var sObserve = $(el).attr('en-observe');
            _self._view._observe(el, 'change', sObserve);
        });           
    }
});

////////////////////////////////////////////////////////////////////////////
/*
    ENGINE class

    Main application engine class.
    
    Parameters 
        appName : User defined application name
        options : A JSON object set of component control options
        
        options = {
            methods: {      // this optional property add custom methods to tbe application instance
            }
        }
*/
////////////////////////////////////////////////////////////////////////////
var engine = baseClass.extend({
    init:function(appName,options) {
        this._super();
        if (appName == null) 
        {
            return;
        }
        this.appName = appName;
        if (_core.app && _core.app.appName) 
        {
            this.log("WARNING: Only one app object per application");
            return;
        }
        // register with the core
        _core.app = this;
        if (options)
        {
            if (typeof options.methods == "object")
            {
                for (var key in options.methods) 
                {
                    var reserved = ["main","fire","attachComponent","attachConstants",
                                    "attachRouter","ready","render","getModel","getModelData","getComponent"];
                    if (reserved.indexOf(key) == -1)
                        this[key] = options.methods[key];
                    else
                        this.log("WARNING: method matched reserved name");
                };
            }
        }
        this.events = new appEvents();
        
        // Initialise Handlebars
        Handlebars.__switch_stack__ = [];

        Handlebars.registerHelper( "switch", function( value, options ) {
            Handlebars.__switch_stack__.push({
                switch_match : false,
                switch_value : value
            });
            var html = options.fn( this );
            Handlebars.__switch_stack__.pop();
            return html;
        } );
        Handlebars.registerHelper( "case", function( value, options ) {
            var args = Array.from( arguments );
            var options = args.pop();
            var caseValues = args;
            var stack = Handlebars.__switch_stack__[Handlebars.__switch_stack__.length - 1];
            
            if ( stack.switch_match || caseValues.indexOf( stack.switch_value ) === -1 ) {
                return '';
            } else {
                stack.switch_match = true;
                return options.fn( this );
            }
        } );
        Handlebars.registerHelper( "default", function( options ) {
            var stack = Handlebars.__switch_stack__[Handlebars.__switch_stack__.length - 1];
            if ( !stack.switch_match ) {
                return options.fn( this );
            }
        } );
        Handlebars.registerHelper( "enc", function( inputData ) {
            return new Handlebars.SafeString(inputData);
        } );
        this.pgHeight = $(document).height();
        this.pgWidth = $(document).width();
    },
    // Stubbs
    setOnline:function()
    {

    },
    ajax:function(config)
    {
        try
        {
            if (config.url == null) return;
            if (config.dataType == null) config.dataType = 'json';
            if (config.type == null) config.type = 'POST';
            config.data = config.params;
            if (config.error)
            {
                config.failed = config.error;
                config.error = function(jqXHR, errText, err)
                {
                    config.failed(jqXHR, errText, err)
                }
            }
            $.ajax(config);
        }
        catch (e)
        {
            alert("AJAX Error")
            return null;
        }
    },
    createModel:function(data,options)
    {
        return new model(data,options);
    },
    createView:function(html,options)
    {
        return new view(html,options);
    },
    createComponent:function(model,view,options)
    {
        return new component(model,view,options);
    },
    registerElement:function(name, _model, _view, _options)
    {
        _core.elements[name] = { model: _model, view: _view, options: _options };
        return _core.elements[name];
    },
    isAttachedComponent:function(_component)
    {
        return _core.components[_component] ? true : false;
    },
    isAttachedModel:function(_model)
    {
        return _core.models[_model] ? true : false;
    },
    fire:function(_component,_method)
    {
        var ev = window.event;
        var _self = this;
        var comp = _core.components[_component];
        return new Promise((resolve, reject) => {
            try
            {
                if (comp)
                {
                    if (comp[_method]) comp[_method].call(comp,ev);
                }
                resolve();
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    },
    attachComponent:function(name,_component)
    {
        if (!_component instanceof component) 
        {
            this.log("WARNING: attachComponent() parameter not of class component");
            return;
        }
        try
        {
            _core.components[name]  = _component;
        }
        catch(e)
        {
        }        
    },
    attachModel:function(name,_model)
    {
        if (!_model instanceof model) 
        {
            this.log("WARNING: attachModel() parameter not of class model");
            return;
        }
        try
        {
            _core.models[name]  = _model;
        }
        catch(e)
        {
        }        
    },
    attachConstants:function(name,_constant)
    {
        if (typeof _constant != "string") 
        {
            this.log("WARNING: attachConstants() parameter not of type string / Const");
            return;
        }
        try
        {
            _core.constants[name]  = _constant;
        }
        catch(e)
        {
        }        
    },
    attachRouter:function(name,_router)
    {
        if (!_router instanceof router) 
        {
            this.log("WARNING: attachRouter() parameter not of class router");
            return;
        }
        try
        {
            _core.routers[name]  = _router;
        }
        catch(e)
        {
        }        
    },
    getComponent:function(_component)
    {
        return _core.components[_component];
    },
    getModel:function(_model)
    {
        return _core.models[_model];
    },
    ready:function() {
        $('[data-toggle="popover"]').popover();
        if (this.onready) this.onready.call(this);
        return new Promise((resolve, reject) => {
            try
            {
                resolve(this.container)
            }
            catch(e)
            {
                reject(e); 
            }    
        });                    
    },
    uiReady:function() 
    {
        // Should really only call this once
        return new Promise((resolve, reject) => {
            try
            {
                if (typeof $ui != "undefined")
                {        
                    $ui.uiReady();
                }
                resolve()
            }
            catch(e)
            {
                reject(e); 
            }    
        });                    
    },
    render:function(sContainer,sClassName = "", sStyle = "")
    {
        return new Promise((resolve, reject) => {
            try
            {
                let container = document.body;
                if (typeof sContainer == "string")
                {
                    container = $(sContainer);
                    if (container.length == 0)
                    {
                        this.warning("Missing Container");
                        return container;
                    }                
                }
                this.container =  $(container).html(`<div id="${this.appName}" class="${sClassName}" style="${sStyle}"></div>`);
                resolve(this.container);    
            }
            catch(e)
            {
                reject(e); 
            }    
        });
    },
    getModel:function(name)
    {
        try
        {
            return _core.models[name];               
        }
        catch(e)
        {
            return null;
        }
    },
    getModelData:function(name)
    {
        try
        {
            return _core.models[name]._data;               
        }
        catch(e)
        {
            return null;
        }
    },
    getComponent:function(name)
    {
        try
        {
            return _core.components[name];               
        }
        catch(e)
        {
            return null;
        }
    },
	done: function (timeout)
	{
		if (timeout == null) timeout = 1500;
		var sHTML = "<div id='_done' class='en-done fa fa-check fa-3x'></div>";
		$('body').append(sHTML);
		$delay(timeout, function ()
		{
			$("#_done").remove();
		});
	},
	busy: function (show)
	{
		var sHTML = "<div id='_busy' class='en-busy fa-3x '><i class='fa fa-circle-o-notch fa-spin col-red'></i></div>";
        if (show)
        {
            if ($("#_busy").length)
                $('#_busy').show()
            else
		        $('body').append(sHTML);
        }
        else
			$("#_busy").hide();
	},
    alert:function(config)
    {
        BootstrapDialog.alert(config);
    },
    popup:function(config)
    {
        if (BootstrapDialog == null)
        {
            $debug("warning:"+msg);
            return;
        }
        BootstrapDialog.show(config);    
    },
    warning:function(msg,timeout,sTitle = "WARNING")
    {
        if (BootstrapDialog == null)
        {
            $debug("warning:"+msg);
            return;
        }
        BootstrapDialog.show({
            type:BootstrapDialog.TYPE_WARNING,
            title:sTitle,
            message:msg, 
            closable:true,     
            onshow: function(dialogRef)
            {
                if (typeof timeout == "number")
                {
                    setTimeout(function(){
                        dialogRef.close();
                    }, timeout);                    
                }
            },    
            buttons: [{
                    id: 'btn-ok',   
                    icon: 'glyphicon glyphicon-check',       
                    label: 'OK',
                    cssClass: 'btn-primary',
                    data: {
                        js: 'btn-confirm',
                        'user-id': '3'
                    },
                    autospin: false,
                    action: function(dialogRef){    
                        dialogRef.close();
                    }
                }]
            });
    },
    danger:function(msg)
    {
        if (BootstrapDialog == null)
        {
            $debug("danger:"+msg);
            return;
        }
        BootstrapDialog.show({
            type:BootstrapDialog.TYPE_DANGER,
            title:'DANGER:',
            message:msg, 
            closable:true,         
            buttons: [{
                    id: 'btn-ok',   
                    icon: 'glyphicon glyphicon-check',       
                    label: 'OK',
                    cssClass: 'btn-primary',
                    data: {
                        js: 'btn-confirm',
                        'user-id': '3'
                    },
                    autospin: false,
                    action: function(dialogRef){    
                        dialogRef.close();
                    }
                }]
            });
    },
    confirm:function(msg,callback,title,size)
    {
        if (BootstrapDialog == null)
        {
            $debug(msg);
            return;
        }
        BootstrapDialog.confirm({
            size:size,
            title:title,
            message:msg,
            callback:callback
        });
    },
    yesno:function(msg,callback,title,size)
    {
        if (BootstrapDialog == null)
        {
            $debug(msg);
            return;
        }
        BootstrapDialog.show({
            type:BootstrapDialog.TYPE_PRIMARY,
            title:title,
            message:msg, 
            buttons: [{
                    id: 'btn-yes',   
                    label: 'YES',
                    cssClass: 'btn-primary',
                    action: function(dialogRef){    
                        dialogRef.close();
                        callback(true);
                    }
                },{
                    id: 'btn-no',   
                    label: 'NO',
                    cssClass: 'btn-primary',
                    action: function(dialogRef){    
                        dialogRef.close();
                        callback(false);
                    }
                }]
            });
    },
    dialog:function(title,message,size)
    {
        if (BootstrapDialog == null)
        {
            $debug(msg);
            return;
        }
        BootstrapDialog.show({
            size:size,
            title:title,
            message:message,
            buttons: [{
                    id: 'btn-ok',   
                    icon: 'glyphicon glyphicon-check',       
                    label: 'Cancel',
                    cssClass: 'btn-primary',
                    data: {
                        js: 'btn-confirm',
                        'user-id': '3'
                    },
                    autospin: false,
                    action: function(dialogRef){    
                        dialogRef.close();
                    }
                }]
            });
    },
    prompt:function(message,callback,title,value,size,inputType,buttons)
    {
        if (bootbox == null)
        {
            $debug(msg);
            return;
        }
        bootbox.prompt({
            size:size,
            title:title,
            value:value,
            inputType:inputType,
            message:message,
            buttons:buttons,
            callback:callback
        });
    },
    imageupload:function(message,callback,title,size,buttons)
    {
        var randomID = Math.random().toString(36).substring(7);
        var dataUrl = "";
        var display_message = `<div>
            <img id="upload_photo_src_${randomID}" class="img-fluid img-thumbnail" src="" width="100%" height="100%" border=0 style="max-height:60vh;vertical-align:center; display: none;" />
            <div style="width: 0px; height: 0px; overflow: hidden;">  
                <input type="file" id="${randomID}" name="${randomID}" value="" />
            </div>
        </div>`;        
        if (BootstrapDialog == null)
        {
            $debug(msg);
            return;
        }
        function readURL(input, width, height) 
        {
            if (input.files && input.files[0]) 
            {
                var reader = new FileReader();
                reader.onload = function(e) 
                {
                    dataUrl = e.target.result;
                    $('#upload_photo_src_' + randomID).attr('src', e.target.result).fadeIn('slow');
                }
                $('#upload_photo_src_' + randomID).show();
                reader.readAsDataURL(input.files[0]);
            }
        }        

        BootstrapDialog.show({
            type:BootstrapDialog.TYPE_INFO,
            title:title,
            message:display_message, 
            closable:true,         
            onshown: function(dialogRef)
            {
                $('#'+randomID).on("change",function() 
                {
                    var url = window.URL || window.webkitURL;
                    var chosen = this.files[0];
                    var image = new Image();
                
                    image.onerror = function() 
                    {
                        alert('Not a valid file type:\n' + chosen.type);
                        return false;
                    };
                
                    width = this.width;
                    height = this.height;
                
                    image.src = url.createObjectURL(chosen);        
                    readURL(this, width, height);        
                })
            },
            buttons: [{
                label: 'Choose Photo',
                action: function(dialogItself) {
                    $('#'+randomID).trigger('click');
                }
            }, 
            {
                label: 'Upload',
                action: function(dialog) 
                {
                    if (callback) callback(dataUrl)
                    dialog.close();
                }
            },
            {
                label: 'Close',
                action: function(dialog) 
                {
                    dialog.close();
                }
            }]
        });        
    },
    fileupload:function(title,params= {},sUrl,callback)
    {
        var randomID = Math.random().toString(36).substring(7);
        var _self = this;
        var display_message = `<div id="upload">
                    <div id="drop">Drop files here<a>Browse</a>
                        <input type="file" name="files" multiple="multiple" />
                    </div>
                    <div class="fileupload-buttonbar">
                        <div>
                            <button type="submit" class="btn btn-success start"> <i class="glyphicon glyphicon-upload"></i><span>Start upload</span></button>
                            <button type="reset" class="btn btn-warning cancel"> <i class="glyphicon glyphicon-upload"></i><span>Clear upload</span></button>
                            <button type="reset" class="btn btn-danger cancel"> <i class="glyphicon glyphicon-ban-circle"></i><span>Cancel All</span></button>
                        </div>
                    </div>
                    <!-- The table listing the files available for upload/download -->
                    <!--<table class="table table-striped">
                        <tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody>
                    </table>-->
                    <ol class="files upload-files-list"></ol>
                    <!--files go here-->
                </div>`;        
        if (BootstrapDialog == null)
        {
            $debug(msg);
            return;
        }

        BootstrapDialog.show({
            type:BootstrapDialog.TYPE_INFO,
            size: BootstrapDialog.SIZE_WIDE,
            title:title,
            message:$(display_message), 
            closable:true,         
            onshown: function(dialogRef)
            {
                var ol = $('#upload ol');
                $('#drop a').click(function () {
                    $(this).parent().find('input').click();
                });
                $('body').on('click', '#openUpload', function (e) {
                    e.preventDefault();
                    $('#upload ol').empty();
                    $('#uploadModal').modal('show');
                });
                $('#upload').fileupload({
                    messages: {
                        maxFileSize: "File is too big",
                        minFileSize: "File is too small",
                        acceptFileTypes: "Filetype not allowed",
                        maxNumberOfFiles: "Too many files",
                        uploadedBytes: "Uploaded bytes exceed file size",
                        emptyResult: "Empty file upload result"
                    },
                    // Uncomment the following to send cross-domain cookies:
                    //xhrFields: {withCredentials: true},
                    //url: 'AJAX.ashx',
                    url: sUrl,
                    dataType: 'json',
                    disableImageLoad: true,
                    headers: {
                        Accept: "application/json"
                    },
                    formData:params,
                    accept: 'application/json',
                    maxFileSize: 10000000, //5mb
                    maxNumberOfFiles: 5,
                    sequentialUploads: true,
                    //singleFileUploads: false,
                    //resizeMaxWidth: 1920,
                    //resizeMaxHeight: 1200,
                    acceptFileTypes: /(.|\/)(gif|jpe?g|png|pdf)$/i,
                    uploadTemplateId: null,
                    downloadTemplateId: null,
                    uploadTemplate: function (o) {
                        var rows = $();
                        $.each(o.files, function (index, file) {
                            var row = $('<li class="template-upload fade upload-file">' +
                                '<div class="upload-progress-bar progress" style="width: 0%;"></div>' +
                                '<div class="upload-file-info">' +
                                '<div class="filename-col"><span class="filename"></span></div>' +
                                '<div class="filesize-col"><span class="size"></span></div>' +
                                '<div class="error-col"><span class="error field-validation-error"></span></div>' +
                                '<div class="actions-col">' +
                                '<button class="btn btn-xs btn-danger cancel removeFile" data-toggle="tooltip" data-placement="left" title="" data-original-title="Remove file">' +
                                '<i class="glyphicon glyphicon-ban-circle"></i> <span></span>' +
                                '</button> ' +
                                '<button class="btn btn-success start"><i class="glyphicon glyphicon-upload"></i> <span>Start</span></button>' +
                                '</div>' +
                                '</div>' +
                                '</li>');
                            row.find('.filename').text(file.name);
                            row.find('.size').text(o.formatFileSize(file.size));
                            if (file.error) {
                                row.find('.error').text(file.error);
                            }
                            rows = rows.add(row);
                        });
                        return rows;
                    },
                    downloadTemplate: function (o) {
                        var rows = $();
                        $.each(o.files, function (index, file) {
                            var row = $('<li class="template-download fade upload-file complete">' +
                                '<div class="upload-progress-bar progress" style="width: 100%;"></div>' +
                                '<div class="upload-file-info">' +
                                '<div class="filename-col"><span class="filename"></span> - <span class="size"></span></div>' +
                                '<div class="error-col"><span class="error"></span></div>' +
                                '</div>' +
                                '</li>');
            
                            row.find('.size').text(o.formatFileSize(file.size));
                            if (file.error) {
                                row.find('.filename').text(file.name);
                                row.find('.error').text(file.error);
                                row.removeClass('complete').addClass('error');
                            } else {
                                row.find('.filename').text(file.name);
                            }
                            rows = rows.add(row);
                        });
                        return rows;
                    }
                });

                $('#upload').bind('fileuploadprocessalways', function (e, data) {
                    var currentFile = data.files[data.index];
                    if (data.files.error && currentFile.error) {
                        //console.log(currentFile.error);
                        data.context.find(".start").prop('disabled', true);
                        data.context.find('.error').text(currentFile.error);
                        return;
                    }
                });
            
                $('#upload').bind('fileuploadadd', function (e, data) {
                    setTimeout(function () {
                        $('.removeFile').tooltip();
                    }, 0);
                }).bind('fileuploadfail', function (e, data) {
                    if (callback) callback("failed",data);
                }).bind('fileuploadstart', function (e) {
                    _self.busy(true);
                    if (callback) callback("start",e);
                }).bind('fileuploaddone', function (e,data) {
                    _self.busy(false);
                    if (callback) callback("done",data);
                    _self.done();
                })

                
            },
            buttons: [{
                label: 'Close',
                action: function(dialog) 
                {
                    dialog.close();
                }
            }]
        });        
    }
})

////////////////////////////////////////////////////////////////////////////
/*
    HTTP class

    Ajax connect class.
    
    Parameters 
        url : Base URL for all connections
        model  : Used for Lazy link remote data to model
        property : property in model to update with resultant data
        
        This model & property assume the response is in JSON format and contains
        the property "result".
*/
////////////////////////////////////////////////////////////////////////////
var http = baseClass.extend({
    init:function(url,params = {},model,property) {
        this._super();
        this._url = url || "";
        this._model = model;
        this._property = property;
        this._params = params;
    },
    post:function(params,url,type = "json")
    {
        var _self = this;
        var data = $.extend({},this._params,params);
        if (url != null) _self._url = url
        return new Promise((resolve, reject) => {
            try
            {
                if (this._url == null) 
                    reject("No url set");
                else
                {
                    let props = { url:this._url };
                    props.dataType = type;
                    props.type = 'POST';
                    props.data = data;
                    props.error = function(jqXHR, errText, err)
                    {
                        reject(jqXHR, errText, err);
                    }
                    props.success = function(resp)
                    {
                        if (_self._model && _self._property)
                        {
                            _self._model.set(_self._property,JSON.parse(resp.result));
                        }
                        resolve(resp);
                    }
                    $.ajax(props);
                }
            }
            catch(e)
            {
                reject(e); 
            }    
        });
    },
    get:function(params,url,type = "json")
    {
        var _self = this;
        var data = $.extend({},this._params,params);
        if (url != null) _self._url = url
        return new Promise((resolve, reject) => {
            try
            {
                if (this._url == null) 
                    reject("no url set");
                else
                {
                    let props = { url:this._url };
                    props.dataType = type;
                    props.type = 'GET';
                    props.data = data;
                    props.error = function(jqXHR, errText, err)
                    {
                        reject(jqXHR, errText, err);
                    }
                    props.success = function(resp)
                    {
                        if (_self._model && _self._property)
                        {
                            _self._model.set(_self._property,JSON.parse(resp.result));
                        }
                        resolve(resp);
                    }
                    $.ajax(props);
                }
            }
            catch(e)
            {
                reject(e); 
            }    
        });
    },
    delete:function(params,url,type = "json")
    {
        var _self = this;
        var data = $.extend({},this._params,params);
        if (url != null) _self._url = url
        return new Promise((resolve, reject) => {
            try
            {
                if (this._url == null) 
                    reject("no url set");
                else
                {
                    let props = { url:this._url +"?" + $.param(data) };
                    props.dataType = type;
                    props.type = 'DELETE';
                    props.error = function(jqXHR, errText, err)
                    {
                        reject(jqXHR, errText, err);
                    }
                    props.success = function(resp)
                    {
                        if (_self._model && _self._property)
                        {
                            _self._model.set(_self._property,JSON.parse(resp.result));
                        }
                        resolve(resp);
                    }
                    $.ajax(props);
                }
            }
            catch(e)
            {
                reject(e); 
            }    
        });
    },
    attachModel:function(model,property)
    {
        this._model = model;
        this._property = property;
    },
    setParams:function(params)
    {
        return  this._params = params;
    },
    getModel:function()
    {
        return  this._model;
    },
    getProperty:function()
    {
        return  this._property;
    }
});

////////////////////////////////////////////////////////////////////////////
/*
    ROUTER class

    A routing class for navigation between views.
    
    Parameters 
        name : // Name of router
        
    Routing works off the browser HASH # navigation
*/
////////////////////////////////////////////////////////////////////////////
var router = Class.extend({
    init:function(name, options = {}, forceNavigate) {
        if (name == null) return;
        var _self = this; 
        this.name = name || this.guid();
        this.forceNavigate = forceNavigate;
        this.routes = [];
        if (options && $.isArray(options.routes)) this.routes = options.routes;
        $(window).on('hashchange', function(e)
        {
             _self.navigate(window.location.hash);
        });
        _core.attachRouter(name,this);
        this.lastHASH = "";
    }, 
    goBack:function()
    {
        window.history.go(-1);        
    },
    navigate:function(sHash)
    {
        var _self = this; 
        this.lastHASH = sHash;
        sHash = sHash.replace("#","/");
        for (var p in _self.routes)
        {
            if(_self.routes[p].path == sHash || (sHash == "" && _self.routes[p].path == "/") )
            {
                var target = _self.routes[p].component;
                if (target._view._element == null) 
                {
                    console.log("sHash Target page not rendered");
                    return;
                }
                // Check we can navigate
                if (!_self.canNavigate.call(_self,sHash)) return;
                // Hide existing views
                for (var v in _self.routes)
                {
                    var comp = _self.routes[v].component;
                    $(comp._view._element).attr("en-view","inactive");
                    comp.fire("onhide",sHash);
                }
                target.fire("beforeNavigate",sHash);
                $(target._view._element).attr("en-view","active");
                target.refreshData();
                target.fire("afterNavigate",sHash);
                _self.afterNavigate.call(_self,sHash);
                try
                {
                    if (typeof $ui != "undefined")
                    {        
                        $ui.input.activate();
                        $ui.dropdownMenu.activate();
                        $ui.select.activate();    
                    }
                }
                catch(e)
                {
                    $log(e.message)
                }
                return; 
            }
        }
        if (this.forceNavigate)
        {
            debugger;
            window.location.href = document.URL;
            window.location.reload();
        }
    },  
    canNavigate:function(sHash)
    {
        return true;
    },
    afterNavigate:function(sHash)
    {

    },
    navigateTo:function(sHash)
    {
        var _self = this; 
        sHash = sHash.replace("/","#");
        return new Promise((resolve, reject) => {
            try
            {
                // Give time for any previous rendering to take place
                setTimeout(function()
                {
                    if (window.location.hash == "" && sHash == "#")
                        _self.navigate(sHash)
                    else if (window.location.hash != sHash)
                        window.location = sHash;
                    else
                        _self.navigate(sHash)
                    resolve();
                },100);
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    }, 
    goTo:function(sHash)
    {
        var _self = this; 
        sHash = sHash.replace("/","#");
        return new Promise((resolve, reject) => {
            try
            {
                // Give time for any previous rendering to take place
                setTimeout(function()
                {
                    _self.navigate(sHash)
                    resolve();
                },100);
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    }, 
    location:function(sHash)
    {
        return new Promise((resolve, reject) => {
            try
            {
                sHash = sHash.replace("/","");
                if (window.location.hash != sHash)
                    window.location.hash = sHash;
                else
                    this.navigateTo(sHash)
                resolve();
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    },
    add:function(sHash,_component)
    {
        return new Promise((resolve, reject) => {
            try
            {
                this.routes.push({ path:sHash, component:_component })          
                resolve();
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    },
    isRoute:function(sHash)
    {
        var _self = this; 
        sHash = sHash.replace("#","/");
        for (var p in _self.routes)
        {
            if(_self.routes[p].path == sHash || (sHash == "" && _self.routes[p].path == "/") )
                return true;
        }
        return false
    }
})

// Internal engine object/
var $engine = new engine();