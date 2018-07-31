var profileDlg = new dialog({ 
    id:'profileDlg',
    title:'Profile',
    submitText:'Save',
    closeText:'Cancel',
    body:`
        <div class="row">
            <div class="col-md-12">                     
                <div class="form-group form-float">
                    <div class="form-line">
                        <input type="text" class="form-control"  en-bind="profile.newusername" en-attr="value" en-observe="value" required autofocus>
                        <label class="form-label">User</label>
                    </div>
                </div>    
            </div>
        </div>    
        <div class="row">
            <div class="col-md-12">                     
                <div class="form-group form-float">
                    <div class="form-line">
                        <input type="text" class="form-control"  en-bind="profile.newemail" en-attr="value" en-observe="value" >
                        <label class="form-label">Email</label>
                    </div>
                </div>    
            </div>
        </div>    
        <div class="row">
            <div class="col-md-12">                     
                <div class="form-group form-float">
                    <div class="form-line">
                        <input type="password" class="form-control"  en-bind="profile.password" en-attr="value" en-observe="value">
                        <label class="form-label">New Password</label>
                    </div>
                </div>    
            </div>
        </div>    
        <div class="row">
            <div class="col-md-12">                     
                <div class="form-group form-float">
                    <div class="form-line">
                        <input type="password" class="form-control"  en-bind="profile.confirm" en-attr="value" en-observe="value">
                        <label class="form-label">Confirm Password</label>
                    </div>
                </div>    
            </div>
        </div>    
    `,
    methods:{
        onbeforeshow:function()
        {
            var m = this.getModel()
            var data = m.getData();
            m.set("profile.newusername",data.profile.username,false);
            m.set("profile.newemail",data.profile.email,false);
            m.set("profile.password","",false);
            m.set("profile.confirm","",false);
        },
        onsubmit:function()
        {
            debugger;            
            var _self = this;
            var data = this.getModel().getData().profile;
            var now = moment();
            if (data.newusername == "")
            {
                app.warning("Need User Name");
                return;
            }
            if (data.newemail == "")
            {
                app.warning("Need Email");
                return;
            }
            if (data.password != "")
            {
                if (data.confirm != data.password)
                {
                    app.warning("Passwords don't match");
                    return;
                }
                var sMD5 = hex_md5(data.password);
                var options = {};                
                options.command = 'organisation.update';
                options.token = homeModel.get("token");
                options.organisation = homeModel.get('organisation');
                options.userid = homeModel.get('userid');
                options.prop = "password";
                options.value = sMD5;
                connector.get( options )
                    .then(function(resp)
                    {
                        if (resp.success)
                        {
                            app.done();
                        }
                        else
                            app.warning(resp.errors[0].error);
                    });
            }
            debugger;
            homeModel.set("profile.username",data.newusername);
            homeModel.set("profile.email",data.newemail);
            this.close();
        }
    }    
},homeModel)

