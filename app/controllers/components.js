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
        onselected:function(selected)
        {              
            alert(selected.text);        
        }
    }
},categoryModel);

var lstGroup = new listgroup({
    id:'lstGroup',
    methods:{
        onselected:function(selected, clickedIndex)
        {              
            alert(selected.text);        
        }
    }
},categoryModel);

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