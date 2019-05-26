//--------------------------------------------------------------------------------
// Components  Page
//--------------------------------------------------------------------------------

var componentsView = new view("",{ url:"./app/views/components.html"});

var categoryLst = new select({  
    id:'categoryLst',
    methods:{
        onselected:function(selected, clickedIndex)
        {      
            alert(selected);        
        }
    }
},categoryModel);
    
var dropdownBtn = new dropdown({
    id:'dropdownBtn',
    text:'Dropdown',
    methods:{
        onselected:function(selected, clickedIndex)
        {              
        }
    }
},categoryModel);

var lstGroup = new listgroup({
    id:'lstGroup',
    methods:{
        onselected:function(selected, clickedIndex)
        {              
        }
    }
},categoryModel);

var dvproducts = new dataView({  
    id:'dvproducts',
    dataBind:'data',
    cls:'dvproducts',
    methods:{
        oninit:function()
        {
            this.template = `<div class="card en-left dvcard" style="width: 30rem;min-height:280px;" data-index="{index}">
                <div class="p-t-5 header bg-light-green">
                    <div class="row">
                        <div class="col-md-12">
                            {fdName}
                        </div>        
                    </div>        
                </div>        
                <div class="body">
                    <div class="row">
                        <div class="col-md-12" style="height:200px;overflow:auto;word-break:break-word;hyphens: manual;">
                            {fdDesc}
                        </div>        
                   </div>        
                </div>        
            </div>  `
        },
        emptyRender:function()
        {
            return `<h1>No Products</h1>`;
        },
        dataRender:function(entry,index)
        {
            var output = this.template;
            /*
            if (entry.fdCategory != "")
            {
                var categoryIndex = productsModel.get("categoryIndex");
                var idx = categoryModel.search("data","text",entry.fdCategory);
                if (idx == -1) return "";
                if (idx != categoryIndex) return "";
            } 
            */           
            for (var key in entry) 
            {
                var data = entry[key];
                if (typeof data == "function")
                {
                    data = data.call(_self,entry,index,key);
                }
                if (typeof data == "string" || typeof data == "number")
                {
                    if (key == "fdDesc") data = data.replaceAll("\n","<br>");
                    output = output.replaceAll("{" + key + "}",data);                                    
                }
                else
                     output = output.replaceAll("{" + key + "}","");                                    
            }
            output = output.replaceAll("{id}",this._id + "_" + index);   
            output = output.replaceAll("{index}",index);   
            return output;                      
        }
    }
 },dataModel);
 
var dvallevents = new carousel({  
    id:'dvallevents',
    dataBind:'events',
    methods:{
        oninit:function()
        {
            this.template = `<div class="item {{cls}}"><div class="card" style="width: 390px;margin: 5px 10px 5px 0px;" en-index="{{index}}">
                <div class="header padding-0 ">
                    <img class="img-fluid banner"  src="./assets/images/{{banner}}"/><br>
                </div>        
                <div class="body p-t-0">
                    <div class="row">
                        <div class="col-md-12">       
                            <div class="title">
                                <center>{{ title }}</center>
                            </div>        
                            <div>
                                {{ description }}
                            </div>        
                        </div>        
                    </div>        
                    <div class="row">
                        <div class="col-md-12">       
                            {{ location }}
                            <div class="right times">
                                Times: {{ times }}
                            </div>        
                        </div>        
                    </div>        
                </div>        
            </div></div> `
        },
        emptyRender:function()
        {
            return `<center><h3>Events Comming Soon</h3></center>`;
        },
        dataRender:function(entry,index)
        {
            var output = this.template;
            entry.index = index;
            if (index == 0)
                entry.cls = "active";
            else
                entry.cls = "";
            output = this.compile(output,entry);
            output = output.replaceAll("{{cls}}",entry.cls);   
            output = output.replaceAll("{{id}}",this._id + "_" + index);   
            return output;                      
        }
    }
 },allEventsModel);
 

var componentsPage = new component(
    componentsModel,
    componentsView,
    {
        id:'components',
        methods:{
            ondatachange:function(prop,value)
            {
            },
            afterNavigate:function()
            {
            }
        }
    });