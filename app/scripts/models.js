//--------------------------------------------------------------------------------
// Common Models

var categoryModel = new model({
    data:[
    ]
},
{ 
    name:'categoryModel'
});

var dataModel = new model({
    data:[ ]
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
developmentModel.qty * 2 = {% developmentModel.qty * 2 %}
developmentModel.getQty() * 3 = {% developmentModel.getQty() * 3 %}
developmentModel.qty = {= developmentModel.qty =}
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

var mconnector = new http("./api/");

mconnector.get( { command:'categorys.get' } )
    .then(function(resp)
    {
        if (resp.success)
        {
            categoryModel.set('data',JSON.parse(resp.result));
        }
        else
            app.warning(resp.errors[0].error);                               
    });
    
mconnector.get( { command:'products.get' } )
    .then(function(resp)
    {
        if (resp.success)
        {
            dataModel.set('data',JSON.parse(resp.result));
        }
        else
            app.warning(resp.errors[0].error);                               
    });

   
