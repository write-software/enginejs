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
                if (prop == "newusername" || prop == "newemail" || prop == "password" || 
                    prop == "confirm" || prop == "forgotemail") return;
                if (prop == "website" || prop == "phoneno" || prop == "name" || prop == "denomination" || prop == "belief")
                {
                    entryModel.set(prop,value); 
                    pageModel.set(prop,value);  
                    if (prop == "belief") beliefModel.set("belief",value);
                    if (prop == "denomination") denominationsModel.set("denomination",value);
                }
                if (portalModel.noSync)
                    return;
                var options = {};                
                options.command = 'organisation.update';
                options.token = portalModel.get("token");
                options.organisation = portalModel.get('organisation');
                options.userid = portalModel.get('userid');
                options.prop = prop;
                options.value = value;
                connector.get( options )
                    .then(function(resp)
                    {
                        if (resp.success)
                        {
                            _core.buildPage(dvcards);
                            app.done();
                        }
                        else
                            app.warning(resp.errors[0].error);
                    });
            },
            onimage:function()
            {
                app.imageupload("Select Image",function(dataUrl)
                {
                    if (dataUrl != "")
                    {
                        connector.post( { command:'entry.setimage', token:homeModel.get("token"), organisation:homeModel.get('organisation'), image:dataUrl } )
                            .then(function(resp)
                            {
                                if (resp.success)
                                {
                                    homeModel.noSync = true;
                                    homeModel.set('banner',resp.fn);
                                    homeModel.noSync = false;
                                    app.done();                                
                                }
                                else
                                    app.warning(resp.errors[0].error);
                            });
                    }
                },"Select Image");         
            },
            onprofile:function()
            {
                debugger;
                $("#profileDlg").modal("show");
            },
            beforeNavigate:function(sHash)
            {
              //  alert("Event beforeNavigate " + sHash);
            }
        }
    });
