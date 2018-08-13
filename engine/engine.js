/****************************************************************
 *
 * The author of this software is Steve Egginton.
 *
 * Copyright (c) 2018 The Write Software Company Limited.
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
    constants:{},
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
    isRouter:function(name)
    {
        return this.routers[name] == null ? false : true;
    }
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

//------------------------------------------------------------------------------
// Macros

$debug = function(x) { try { if (console) console.log(x);}catch(e){} };
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
    urldecode:function(x)
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
    urlencode:function(x)
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
        return (width <= text.length) ? text : idev.utils.padl(padding + text, width, padding)
    },
    padr:function(text, width, padding)
    {
        if (padding == null) padding = " ";
        if (padding == "") return string;
        if (!width) return text;
        return (width <= text.length) ? text : idev.utils.padr(text + padding, width, padding)
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
            this.url =  url.substr(0,p);
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
        this.state = options.state || 0;  
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
        this.onSync = new _event( {sender:this} );
        if (typeof options.methods == "object")
        {
            for (var key in options.methods) 
            {
                var reserved = ["_attachController","getState","changeState","set","get","asString"];
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
            var d = this.getLocal(this.name,this._data)
            if (d)
                this._data = d;
            else
                this.storeLocal(this.name,this._data)
        }
        if (this.oninit) this.oninit.call(this);
    },
    _attachController:function(controller,property)
    {
        this._controller = controller;
    },
    getState:function()
    {
        return this.state;
    },
    changeState:function(value)
    {
        this.state = value;
    },
    getData:function()
    {
        return this._data;
    },
    get:function(prop)
    {
        if (prop.substr(0, 2) != "$.") prop = "$." + prop;
        var result = jsonPath(this._data, prop);
        if (result.length == 1)
            return result[0];
        return result;
    },
    sync:function()
    {
        if (this.onbeforesync) this.onbeforesync.call(this);
        this.onSync.notify(this,this._data);   
    },
    set:function(prop, value, updateBinds = true)
    {
        let obj = this._data;
        let propname = prop;
        let p = prop.indexOf(".");
        while (p != -1)
        {
            let element = prop.substr(0, p);
            obj = obj[element];
            prop = prop.substr(p + 1);
            p = prop.indexOf(".");
        }
        var oldvalue = obj[prop];
        obj[prop] = value;
        if (updateBinds) this.onChange.notify( { data:this._data,prop:propname,value:value});
        if (this.autoStore)
            this.storeLocal(this.name,obj)
    },
    applyJSON:function(json,_exclude = "")
    {
        if (typeof json != "object") return;
        for (var key in json) 
        {
            if (_exclude )
            {
                if (_exclude.indexOfWord(key) == -1)
                    this._data[key] = json[key];
            }
            else
                this._data[key] = json[key];
        }        
    },
    push:function(prop, value)
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
        this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeLocal(this.name,this._data)
    },
    pop:function(prop)
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
        this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeLocal(this.name,this._data)
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
    removeAt:function(prop,index)
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
        this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeLocal(this.name,this._data)
        return value;
    },
    insertAt:function(prop,index,value)
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
        this.onChange.notify( { data:this._data,prop:prop,value:obj[prop]});
        if (this.autoStore)
            this.storeLocal(this.name,this._data)
    },
    asString:function()
    {
        return JSON.stringify (this._data);
    },
    search:function(_prop,_key,_value)
    {
        var d = this._data[_prop];
        if (d)
        {
            for (var i = 0;i < d.length;i++)
            {
                var e = d[i][_key];
                if (e && e == _value) return i;
            }
        }
        return -1;    
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
        $(element).unbind(event);
        $(element).bind(event,
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
                    var line = template;
                    for (var key in entry) 
                    {
                        var data = entry[key];
                        if (typeof data == "function")
                        {
                            data = data.call(_self,entry,index,key);
                        }
                        if (typeof data == "string")
                            line = line.replaceAll("{" + key + "}",data);                                    
                        else
                             line = line.replaceAll("{" + key + "}","");                                    
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
                output += _self._controller.beforeDataRender();
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
                    marker = "<span class='en-bind' en-bind='" + marker + "'></span>";
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
                            marker = "<span class='en-bind' en-model='" + obj + "' en-bind='" + sProp + "'></span>";
                        else
                            marker = "<span class='en-bind' en-bind='" + marker + "'></span>";
                    }
                    else
                        marker = "<span class='en-bind' en-bind='" + marker + "'></span>";
                    html = html.replace(placeholder, marker);    
                }
            }
        }
        var exp = /{=\s*([^}]+)\s*=}/g
        var placeholders = html.match(exp);
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
            if (value.toString().indexOf("<") == -1)
                value = value.toString().replaceAll("\n","<br/>");
            $(el).html(value);
        }
        else if (attr == "number")
            $(el).text(value.toString());
        else if (attr == "value")
        {
            $(el).val(value);
            $(el).focus();
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
                    }
                    else
                    {
                        sBind = "_self.model." + sBind;
                    }
                    try
                    {
                        let value = "";
                        try
                        {
                            value = eval(sBind);
                        }
                        catch(e)
                        {
                            value = "";                    
                        }
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
                        _self._applyEvents();
                    }
                    else if (replace)
                    {
                        $(selector).replaceWith(_self._element);
                        _self._applyEvents();
                        _self._binds(data);
                    }
                    else
                    {
                        $(selector).html(_self._element);            
                        _self._binds(data);
                        _self._applyEvents();
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
                _self.log(arg.prop);
                _self._view._binds(arg.data,arg.prop,arg.value);
                $('select:not(.ms)').selectpicker('refresh');
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
        this._model.onSync.attach(
            (sender, arg) =>
            {
                _self.refreshData();
                if (_self.ondatachange) 
                {
                     $('select:not(.ms)').selectpicker('refresh');
                    _self.ondatachange.call(_self,"*",null,arg.data);
                }
            }
        );
        // Create a callback on any change to the view
        this._view.onChange.attach(
            (sender, data) =>
            {
                let el = data.event.target;
                let sProp = $(el).attr("en-bind");
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
                    if(el.length != 0)
                    {
                        comp.render(el,false,false);   
                    }
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
    }
});

////////////////////////////////////////////////////////////////////////////
/*
    ENGINE class

    Main application engine class.
    
    Parameters 
        _model : Model to be used (MUST EXISTS)
        _view  : VIEW to be used (MUST EXISTS)
        options : A JSON object set of component control options
        
        options = {
            appName:""      // Application Name mainly for vanity. 
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
                $.engine.input.activate();
                $.engine.navbar.activate();
                $.engine.dropdownMenu.activate();
                $.engine.select.activate();                
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
            return "";
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
            return "";
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
            return "";
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
    warning:function(msg)
    {
        if (BootstrapDialog == null)
        {
            $debug("warning:"+msg);
            return;
        }
        BootstrapDialog.show({
            type:BootstrapDialog.TYPE_WARNING,
            title:'WARNING:',
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
    confirm:function(message,callback,title,size,buttons)
    {
        if (BootstrapDialog == null)
        {
            $debug(msg);
            return;
        }
        BootstrapDialog.confirm({
            size:size,
            title:title,
            message:message,
            callback:callback
        });
    },
    prompt:function(message,callback,title,size,inputType,buttons)
    {
        if (bootbox == null)
        {
            $debug(msg);
            return;
        }
        bootbox.prompt({
            size:size,
            title:title,
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
                })
                    .bind('fileuploadprogress', function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    data.context.find('.progress').css('width', progress + '%');
                })
                    .bind('fileuploadfail', function (e, data) {
                    console.log('fail');
                }).bind('fileuploadstart', function (e) {
                    _self.busy(true);
                    if (callback) callback("send",e.data);
                }).bind('fileuploaddone', function (e,data) {
                    _self.busy(false);
                    if (callback) callback("done",e.data);
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
    init:function(url,model,property) {
        this._super();
        this.url = url || "";
        this._model = model;
        this._property = property;
    },
    post:function(params,type = "json")
    {
        var _self = this;
        _self.params = params;
        return new Promise((resolve, reject) => {
            try
            {
                if (this.url == null) 
                    reject("no url set");
                else
                {
                    let props = { url:this.url };
                    props.dataType = type;
                    props.type = 'POST';
                    props.data = params;
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
    get:function(params,type = "json")
    {
        var _self = this;
        _self.params = params;
        return new Promise((resolve, reject) => {
            try
            {
                if (this.url == null) 
                    reject("no url set");
                else
                {
                    let props = { url:this.url };
                    props.dataType = type;
                    props.type = 'GET';
                    props.data = params;
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
    DATAMAP class

    A class is for mapping data properties between JSON Objects, works with Store class.
    
    This provides two-way movement of data.
*/
////////////////////////////////////////////////////////////////////////////
var dataMap = baseClass.extend({
    init:function() 
    {
        this._super();
        this._map = [];
    },
    map:function(_sourceObj,_targetObj,_props)
    {
        this._map = [];
        if (typeof _props == "string")
        {
            let props = _props.split(",");
            for (let i = 0;i < props.length;i++)
            {
                let sProp = props[i];
                this._map.push( { source:_sourceObj, target:_targetObj, prop:sProp});
            }
        }
        if (typeof _props == "function")
        {
            this._map.push( { source:_sourceObj, target:_targetObj, prop:_props});
        }
        return this._map.length;  
    },
    applyTarget:function()
    {
        for (let i = 0;i < this._map.length;i++)
        {
            let m = this._map[i];
            if (typeof m.prop == "function")
                m.prop(m.source,m.target);
            else
            {
                var prop = m.prop;
                var s = m.source; 
                var t = m.target; 
                while ((d = prop.indexOf(".")) != -1)
                {
                    let p = prop.substr(0,d);
                    s = s[p];
                    t = t[p];
                    prop = prop.substr(d+1);
                }
                s[prop] = t[prop];
            }
        }
    },
    applySource:function()
    {
        for (let i = 0;i < this._map.length;i++)
        {
            let m = this._map[i];
            if (typeof m.prop == "function")
                m.prop(m.target,m.source);
            else
            {
                var prop = m.prop;
                var s = m.source; 
                var t = m.target; 
                while ((d = prop.indexOf(".")) != -1)
                {
                    let p = prop.substr(0,d);
                    s = s[p];
                    t = t[p];
                    prop = prop.substr(d+1);
                }
                t[prop] = s[prop];
            }
        }
    }
})

////////////////////////////////////////////////////////////////////////////
/*
    STORE class

    A store is for general data storage and works with PouchDB and the DataMaps class.
    
    Parameters 
        options : {
            type:'simple',  // Works like a model but much simpler
            data: [],       // Used with simple type
            methods:{
            }
        }
*/
////////////////////////////////////////////////////////////////////////////
var store = baseClass.extend({
    init:function(options) 
    {
        this._super();
        this.db = null;
        this.data = [];
        this.dataMaps = [];
        if (options)
        {
            this.type = options.type || "simple";
            if (this.type == "simple")
            {
                if (options.data instanceof Array)
                {
                    this.data = options.data;   
                }
            }
            if (typeof options.methods == "object")
            {
                for (var key in options.methods) 
                {
                    var reserved = ["openDB","put","get"];
                    if (reserved.indexOf(key) == -1)
                        this[key] = options.methods[key];
                    else
                        this.log("WARNING: method matched reserved name");
                };
            }
        }
    },
    openDB:function(sName = "unknown",opts = {skip_setup: true})
    {
        var _self = this;
        return new Promise((resolve, reject) => {
            try
            {        
                if (_self.type == "simple")
                {
                    throw "Method openDB not allowed on type 'simple'";
                }
                _self.db = new PouchDB(sName, opts);
                _self.db.changes({
                  since: 'now',
                  live: true,
                  include_docs: true
                }).on('change', function (change) {
                    _self.onchange(change)   
                }).on('error', function (err) {
                    _self.onerror(err)   
                });
                resolve(_self.db);
            }
            catch(e)
            {
                reject(e); 
            }    
        });        
    },
    put:function(data)
    {
        var _self = this;
     //   delete data._rev;
        return new Promise((resolve, reject) => {
            try
            {        
                if (typeof data != "object")
                    throw "Invalid type for method put on store";
                if (_self.type == "simple")
                {
                    if (!data._id) data._id = new Date().toISOString();
                    _self.data.push(data);    
                }
                else
                {
                    if (!data._id) data._id = new Date().toISOString();
                    _self.db.put(data, {force:true});
                }
                resolve(_self);
            }
            catch(e)
            {
                reject(e); 
            }    
        });        
    },
    get:function(id)
    {
        var _self = this;
        return new Promise((resolve, reject) => {
            try
            {        
                if (_self.type == "simple")
                {
                    if (id != null)
                    {
                        var results = [];
                        for (key in _self.data)
                        {
                            var entry = _self.data[key];
                            if (entry._id == id)
                            {
                                results.push(entry);
                                break;
                            } 
                        }
                        resolve(results);
                    }
                    else
                        resolve(_self.data);
                }
                else
                {
                    _self.db.get(id).then(function(doc)
                    {
                        resolve(doc);
                    }).catch(function(err)
                    {
                        reject(err); 
                    });
                }
            }
            catch(e)
            {
                reject(e); 
            }    
        });        
    },
    find:function(criteria)
    {
        var _self = this;
        return new Promise((resolve, reject) => {
            try
            {        
                if (_self.type == "simple")
                {
                    if (id != null)
                    {
                        var results = [];
                        for (key in _self.data)
                        {
                            var entry = _self.data[key];
                            if (entry._id == id)
                            {
                                results.push(entry);
                                break;
                            } 
                        }
                        resolve(results);
                    }
                    else
                        resolve(_self.data);
                }
                else
                {
                    var doc =  _self.db.find(criteria);
                    resolve(doc);
                }
            }
            catch(e)
            {
                reject(e); 
            }    
        });        
    },
    attachModel:function(_docname, _template, _subset, _model, _props)
    {
        this.dataMaps[_docname] = { 
            model: _model, 
            template: _template, 
            subset: _subset, 
            dataMap: new dataMap(), 
            props: _props 
        };
    },
    initDataMaps:function()
    {
        for (var docname in this.dataMaps) 
        {
            let map = this.dataMaps[docname];
            coreData.get(docname)
            .then(function(doc)
            {
                let source;
                if (map.subset)
                    source = doc[map.subset];
                else
                    source = doc;
                map.dataMap.map(source,map.model.getData(),map.props);
                map.dataMap.applySource();
                map.model.sync();
            })
            .catch(function(err)
            {
                if (err.status == 404)
                {
                    let source;
                    if (map.subset)
                        source = map.template[map.subset];
                    else
                        source = map.template;
                    coreData.put(map.template); 
                    map.dataMap.map(source,map.model.getData(),map.props);
                    map.dataMap.applySource();
                }
            });
        }
    },
    updateDataMap:function(docname)
    {
        let _self = this;
        let map = _self.dataMaps[docname];
        coreData.get(docname)
        .then(function(doc)
        {
            let source;
            if (map.subset)
                source = doc[map.subset];
            else
                source = doc;
            map.dataMap.map(source,map.model.getData(),map.props);
            map.dataMap.applyTarget();
            coreData.put(doc); 
        })
        .catch(function(err)
        {
            _self.warning(`updateDataMap doc ${docname} not found`);    
        });
    },
    onchange:function(change)
    {
        // handle change
    },
    onerror:function(err)
    {
        // handle errors
    }
})

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
    init:function(name) {
        if (name == null) return;
        var _self = this; 
        this.name = name || this.guid();
        this.routes = [];
        $(window).on('hashchange', function(e){
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
            if(_self.routes[p].hash == sHash || (sHash == "" && _self.routes[p].hash == "/") )
            {
                var target = _self.routes[p].component;
                if (target._view._element == null) 
                {
                    console.log("sHash Target page not rendered");
                    return;
                }
                // Hide existing views
                for (var v in _self.routes)
                {
                    var comp = _self.routes[v].component;
                    $(comp._view._element).attr("en-view","inactive");
                    comp.fire("onhide",sHash);
                }
                if (!_self.canNavigate.call(_self,sHash)) return;
                target.fire("beforeNavigate",sHash);
                $(target._view._element).attr("en-view","active");
                target.refreshData();
                target.fire("afterNavigate",sHash);
                $.engine.input.activate();
                $.engine.dropdownMenu.activate();
                $.engine.select.activate();
                break; 
            }
        }
    },  
    canNavigate:function(sHash)
    {
        return true;
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
                    window.location = sHash;
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
                this.routes.push({ hash:sHash, component:_component })          
                resolve();
            }
            catch(e)
            {
                reject(e); 
            }    
        });    
    }
})

// Internal engine object/
var $en = new engine();