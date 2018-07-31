//--------------------------------------------------------------------------------
// DashboardPage
//--------------------------------------------------------------------------------

var dashboardView = new view("",{ url:"./app/views/dashboard.html"});

var dashboardModel = new model({
        comments:[]
    },
    {
        name:'dashboardModel'
    });
           
var dvcomments = new dataView({  
    id:'dvcomments',
    dataBind:'commentsList',
    cls:'dataview',
    methods:{
        oninit:function()
        {
            this.template = `<div class="card speech-bubble m-t-5" style="width: 94%;margin-left:20px;margin-bottom:5px;" en-index="{{index}}">
                <div class="body padding-10 " style="">
                    <div class="row ">
                        <div class="col-md-1 margin-b-0">
                            <i class="material-icons">chat_bubble_outline</i>
                        </div>        
                        <div class="col-md-2 margin-b-0 font-10 ">
                            {{enc datetime}}
                        </div>        
                        <div class="col-md-9  margin-b-0">
                            {{comment}}
                        </div>        
                   </div>        
                </div>        
            </div>  `
        },
        emptyRender:function()
        {
            return `<center><h1>No Comments</h1></center>`;
        },
        dataRender:function(entry,index)
        {
            var output = this.template;
            if (entry.datetime.indexOf("/") == -1)
            {
                var now = moment(entry.datetime,"YYYYMMDDHHmmss");
                entry.datetime = now.format("DD/MM/YYYY<br>HH:mm");
            }
            entry.index = index;
            output = this.compile(output,entry);
            output = output.replaceAll("{{id}}",this._id + "_" + index);   
            return output;                      
        }
    }
 },dashboardModel);

var dashboardPage = new component(
    dashboardModel,
    dashboardView,
    {
        id:'dashboard',
        methods:{
            ondatachange:function(prop,value)
            {
                $('.' + prop).countTo({ from: 0, to: value, speed:1000 });
            },
            monitorStats:function()
            {
                connector.get( { command:'stats',  token:portalModel.get("token"), organisation:portalModel.get("organisation") } )
                    .then(function(resp)
                    {
                        if (resp.success)
                        {
                            if (resp.searches != dashboardModel.get("searches")) dashboardModel.set("searches",resp.searches);
                            if (resp.reviews != dashboardModel.get("reviews")) dashboardModel.set("reviews",resp.reviews);
                            if (resp.comments != dashboardModel.get("comments")) dashboardModel.set("comments",resp.comments);
                            if (resp.visitors != dashboardModel.get("visitors")) dashboardModel.set("visitors",resp.visitors);
                        }
                        $delay(10000,dashboardPage.monitorStats);                        
                    });
                    connector.get( { command:'comments.get', token:portalModel.get("token"), organisation:portalModel.get("organisation") } )
                        .then(function(resp)
                        {
                            if (resp.success)
                            {
                                dashboardModel.set('commentsList',JSON.parse(resp.comments),true);
                            }
                            else
                                $debug(resp.errors[0].error);                               
                        });
            }
        }
    });