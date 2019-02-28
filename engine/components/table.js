var table = component.extend({
    init:function(options = {},_model) 
    {
        var _self = this;
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
        this.dataBind = options.dataBind;
        this._super(_model,_view,options);
        if ($.fn.dataTableExt && $.fn.dataTableExt.afnFiltering)
        {
            $.fn.dataTableExt.afnFiltering.push(
                function( oSettings, aData, iDataIndex ) 
                {
                    if (oSettings.nTable.id)
                    {
                        comp = $engine.getComponent(oSettings.nTable.id);
                        if (comp && typeof comp.options.filter == "function")
                                return comp.options.filter(aData,iDataIndex);
                    }
                    return true;
                });    
        }
    },
    _onrender:function()
    {
        var _self = this;
        var recs = this.getModel().getData()[this.dataBind];
        setTimeout(function()
        {
            var opts = {
                responsive: true
            };
            opts = $.extend(opts,_self.options);
            delete opts.id;
            delete opts.methods;
            delete opts.filter;
            delete opts.dataBind;
            delete opts.cls;
            delete opts.style;
            opts.data = recs;
            _self.log(JSON.stringify(opts))
            _self.table = $('#'+_self._id).DataTable(opts).columns.adjust()
            $('#'+_self._id + ' tbody').on('click', 'tr', function () 
                {
                    var row = _self.table.row( this );
                    var data = row.data();
                    if (!opts.noselect)
                    {
                        if (opts.select && opts.select.style == "single")
                            $('#'+_self._id + ' tbody').find('tr.en_selected').removeClass('en_selected'); 
                         $(this).toggleClass('en_selected');
                    }
                    _self.onrow.call(this,data,row);
                } );
            $('#'+_self._id + ' tbody').on('click', 'td', function (event) 
                {
                    var column = _self.table.columns( this );
                    var cell = column.cell( this )[0][0];
                    _self.oncolumn.call(this,column,cell,event);
                } );
            if (_self.afterrender) _self.afterrender.call(_self ) ;
        },250);
    },
    // Stub functions
    onrow:function(data)
    {
    },
    oncolumn:function(data,index)
    {
    },
    // End Stub functions
    getSelected:function()
    {
        return this.table.rows('.en_selected').data();
    },
    search:function(text = "")
    {
        this.table.search(text).draw();
    },
    refresh:function()
    {
        this.table.draw();
    },
    redraw:function()
    {
        this.table.clear().draw();
        this.table.rows.add(this.getModel().get(this.dataBind)).draw( false );
    },
    refreshRows:function(_selector)
    {
        this.table.rows( _selector ).invalidate().draw();
    },
    clearSelection:function()
    {
        $('#'+this._id + ' tbody').find('.en_selected').removeClass('en_selected');
    },
    _ondatachange:function(prop,value,modeldata)
    {
        var _self = this;
        if (prop == this.options.dataBind && this.table)
        {
            this.table.clear().draw();
            this.table.rows.add(modeldata[this.dataBind]).draw( false );
        }
    },
});    

