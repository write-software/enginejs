var homeView = $en.createView("",{ url:"./app/views/home.html" });

rightSideBar = {
    activate: function () {
        var _this = this;
        var $sidebar = $('#rightsidebar');
        var $overlay = $('.overlay');

        //Close sidebar
        $(window).click(function (e) {
            var $target = $(e.target);
            if (e.target.nodeName.toLowerCase() === 'i') { $target = $(e.target).parent(); }

            if (!$target.hasClass('js-right-sidebar') && _this.isOpen() && $target.parents('#rightsidebar').length === 0) {
                if (!$target.hasClass('bars')) $overlay.fadeOut();
                $sidebar.removeClass('open');
            }
        });

        $('.js-right-sidebar').on('click', function () {
            $sidebar.toggleClass('open');
            if (_this.isOpen()) { $overlay.fadeIn(); } else { $overlay.fadeOut(); }
        });
    },
    isOpen: function () {
        return $('.right-sidebar').hasClass('open');                         
    }
};

function setSettingListHeightAndScroll(isFirstTime) {
    var height = $(window).height() - ($('.navbar').innerHeight() + $('.right-sidebar .nav-tabs').outerHeight());
    var $el = $('.right-sidebar .settings');

    if (!isFirstTime){
      $el.slimScroll({ destroy: true }).height('auto');
      $el.parent().find('.slimScrollBar, .slimScrollRail').remove();
    }

    $el.slimscroll({
        height: height + 'px',
        color: 'rgba(0,0,0,0.5)',
        size: '6px',
        alwaysVisible: false,
        borderRadius: '0',
        railBorderRadius: '0'
    });
};

var homePage = new component(
    homeModel,
    homeView,
    {
        id:'portal',
        methods:{
            onrender:function()
            {
                setSettingListHeightAndScroll(true);
                $(window).resize(function () {
                    setSettingListHeightAndScroll(false);
                });
                rightSideBar.activate();
                $('.nav-tabs a:first').tab('show');
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
