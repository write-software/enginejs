var table = component.extend({
    init:function(options = {},_model) 
    {
        let _options = {};
        options.data =  options.data || [];
        options.dataBind = options.dataBind || "data";
        options.cls = options.cls || "";
        options.style = options.style || "";
        options.columns = options.columns || [];
        let html = `
            <div  style="${options.style}">
            <table id='${options.id}' class="table-hover table-striped table-responsive display dataTable ${options.cls}" style="width:100%;">
            </table>
            </div>`;
        let _view = new view(html);
        if (!_model)
            _model = new model ({ 
                data: options.data 
            });
        this.dataBind = options.dataBind
        this._super(_model,_view,options);
    },
    _onrender:function()
    {
        var _self = this;
        debugger;
        var recs = this.getModel().getData()[this.dataBind];
        setTimeout(function()
        {
            var opts = {
                responsive: true
            };
            opts = $.extend(opts,_self.options);
            delete opts.id;
            delete opts.methods;
            delete opts.dataBind;
            delete opts.cls;
            delete opts.style;
            opts.data = recs;
            _self.table = $('#'+_self._id).DataTable(opts);
            $('#'+_self._id + ' tbody').on('click', 'tr', function () 
                {
                    var data = _self.table.row( this ).data();
                    _self.onrow.call(this,data)
                } );  
        },150);
    },
    onrow:function(data)
    {
    },
    _ondatachange:function(prop,value,modeldata)
    {
        if (prop == this.options.dataBind && this.table)
        {
            this.table.clear().draw();
            this.table.rows.add(modeldata[this.dataBind]).draw( false );
        }
    },
});    

