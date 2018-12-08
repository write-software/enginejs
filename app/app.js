
var app = new engine("Engine JS Demo",{
    methods:{
        uiReady: function() 
        {
            $ui.uiReady();
            // Add your own UI initialisation or updates here
        }
   }
});

//--------------------------------------------------------------------------------
// Routing

var routing = new router("main");

routing.add("/",homePage);

routing.canNavigate = function(sHash)
{
    return true;
    if(sHash == "/home")
    {               
        if (!signinModel.get("signedin"))
        {
            app.warning("You are not signed in");
            $delay(1000,function()
            {
                routing.navigateTo("/");
            });
            return false;
        } 
    }
    return true;
};

app.ready().then(function()
{
    app.render().then(function(container)
    {                             
        homePage.render(container).then(function()
        {
            homePage.routing = new router("home");
            homePage.routing.add("/dashboard",dashboardPage);
            homePage.routing.add("/development",developmentPage);
            homePage.routing.add("/components",componentsPage);
            homePage.routing.add("/tables",tablesPage);
            var sHash = window.location.hash;
            routing.navigateTo(sHash).then(function()
            {
                homePage.routing.goTo("/dashboard");
                app.uiReady();
            });                    
        });
    });
});
