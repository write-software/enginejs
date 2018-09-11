//--------------------------------------------------------------------------------
// Tables  Page
//--------------------------------------------------------------------------------

var tablesView = new view("",{ url:"./app/views/tables.html"});

var tb = new table({
    id:'tableData',
    dataBind:'data',
    pageLength:9,
    style:"background:#fff;",
    columns:[
        { title:'Name', data:'fdName' },        
        { title:'Description', data:'fdDesc' },        
    ],
    methods:{
        onrow:function(data)
        {              
            alert(data);        
        }
    }
},dataModel);

var tablesPage = new component(
    dataModel,
    tablesView,
    {
        id:'tables',
        methods:{
            ondatachange:function(prop,value)
            {
            },
            afterNavigate:function()
            {
            }
        }
    });