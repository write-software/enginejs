//--------------------------------------------------------------------------------
// Common Models

var categoryModel = new model({
    data:[
        { text:'Cars', value:'Cars' },
        { text:'Electrical', value:'Electrical' },
        { text:'Plants', value:'Plants' },
        { text:'Stationary', value:'Stationary' },
    ]
},
{ 
    name:'categoryModel'
});

var dataModel = new model({
    data:[ 
        { 
            fdGUID:'1527953174_21572300', 
            fdCategory:'Cars', 
            fdProdID:'001', 
            fdName:'Jaguar XK8', 
            fdDesc:'The Jaguar XK8 (project code X100) is a 2-door grand tourer that was launched by Jaguar Cars in 1996, and was the first generation of a new XK series. The XK8 was available in coupé or convertible body styles and with the new 4.0-litre Jaguar AJ-V8 engine.',
            fdQty:8,
            fdTimeStamp:'2018-06-01 18:09:01',
            fdImage:'' 
        },    
        { 
            fdGUID:'1527953174_21571500', 
            fdCategory:'Plant', 
            fdProdID:'002', 
            fdName:'Rose', 
            fdDesc:'A rose is a woody perennial flowering plant of the genus Rosa, in the family Rosaceae, or the flower it bears. There are over three hundred species and thousands of cultivars.',
            fdQty:12,
            fdTimeStamp:'2018-06-02 16:26:14',
            fdImage:'' 
        },    
    ]
},
{
    name:'dataModel'
});

var homeModel = new model ({
    brandtitle:'Engine JS',
    organisation:'',
    title:'',
    subtitle:'',
    lastlogin:'Last Login 18/05/2018',
    name:'Engine JS App',
    logo:'./assets/images/user.png',
    tagline:'Simple and powerful',
    profile:{
        username:'John Doe',
        email:'john.doe@example.com',
    }
},{ name:'home'});

var componentsModel = new model({
    entry:{
        name:'Steve',
        pwd:'',
        remember:'N',
        active:'N'
    },
    title:'Components System',
    list:[
        { name:"BMW" },
        { name:"Mercedes" },
        { name:"Jaguar" },
        { name:"Aston Martin" },
        { name:"Ford" },
    ],
    state : 'page5',
    s : '1'
},
{
    name:'componentsModel'
});

var allEventsModel = new model({
    events:[
        { banner:"default_banner.img", title:"Event 1", description:"First Event", location:"At the pub", times:"20:00 - 23:00" },
        { banner:"default_banner.img", title:"Event 2", description:"Second Event", location:"At the other pub", times:"20:00 - 23:00" }
    ]
},
{
    name:'allEventsModel'
});


var developmentModel = new model({
    entry: {
        name: 'Steve',
            pwd: '',
        remember: 'N',
        active: 'N'
    },
    handlebars: `
    Example:
        {{ title }}
        {{{entry.name}}} 
        {{#if entry.active}} 
            Active 
        {{/if}} 
        {{#each list}}
            <div>{{name}}</div>
        {{/each}} 
        {{#switch state}}
            {{#case "page1" "page2"}}
                page 1 or 2
            {{/case}} 
            {{#case "page3"}}
                page3
            {{/case}} 
            {{#case "page4"}}
                page4
            {{/case}}
            {{#case "page5"}} 
                {{#switch s}} 
                    {{#case "3"}}
                        s = 3
                    {{/case}} 
                    {{#case "2"}}
                        s = 2
                    {{/case}} 
                    {{#case "1"}}s =
                        1
                    {{/case}} 
                    {{#default}}
                        unknown
                    {{/default}} 
                {{/switch}} 
            {{/case}} 
            {{#default}}
                page0
            {{/default}} 
        {{/switch}}

        see https://handlebarsjs.com for full documentation;
    `,
    notation:`
    developmentModel.qty = {= developmentModel.qty =}
    
    developmentModel.qty * 2 = {% developmentModel.qty * 2 %}
    
    developmentModel.getQty() * 3 = {% developmentModel.getQty() * 3 %}
    `,
    binding:html_entity_encode(`
<div en-model="developmentModel" en-bind="title"></div>
or
<div en-bind="developmentModel.title"></div>
or
<div en-bind="title"></div>

for the controller model.
    `),
    title: 'Development System',
    list: [{
            name: "BMW"
        },
        {
            name: "Mercedes"
        },
        {
            name: "Jaguar"
        },
        {
            name: "Aston Martin"
        },
        {
            name: "Ford"
        },
    ],
    qty:2,
    state: 'page5',
    s: '1'
}, {
    name: 'developmentModel',
    methods:{
        getQty: function () {
            return this._data.qty;
        }
    }
});

//==============================================================================
// Using the http class
/*
var connector = new http("./api/");

connector.get( { command:'categorys.get' } )
    .then(function(resp)
    {
        if (resp.success)
        {
            categoryModel.set('data',JSON.parse(resp.result));
        }
        else
            app.warning(resp.errors[0].error);                               
    });
    
connector.get( { command:'products.get' } )
    .then(function(resp)
    {
        if (resp.success)
        {
            dataModel.set('data',JSON.parse(resp.result));
        }
        else
            app.warning(resp.errors[0].error);                               
    });
*/
   
