var homeView = new view("",{ url:"./app/views/home.html" });

var homePage = new component(
    homeModel,
    homeView,
    {
        id:'portal',
        methods:{
            onrender:function()
            {
                $ui.leftSideBar.setSettingListHeightAndScroll(true);
                $(window).resize(function () {
                    $ui.leftSideBar.setSettingListHeightAndScroll(false);
                });
                $ui.rightSideBar.activate();
            },
            goTo:function(page)
            {
                this.routing.goTo(page);
            },
            ondatachange(prop,value)
            {
            },
            onimage:function()
            {
                app.imageupload("Select Image",function(dataUrl)
                {
                    if (dataUrl != "")
                    {
                    }
                },"Select Image");         
            },
            onprofile:function()
            {
                $("#profileDlg").modal("show");
            },
            beforeNavigate:function(sHash)
            {
              //  alert("Event beforeNavigate " + sHash);
            }
        }
    });
