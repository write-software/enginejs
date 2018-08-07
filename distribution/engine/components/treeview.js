var treeview = component.extend({
    init:function(options = {},_model) 
    {
        let _options = {};
        options.data = options.data || [];
        _options.id = options.id;
        let html = `
            <div id="${this.id}" style="max-height:80vh;overflow-y:auto;">
            </div>`;

        let _view = new view(html);
        if (!_model)
            _model = new model ({ data: options.data });
            
        _options.methods = options.methods;
        this._super(_model,_view,_options);
    },
    onrender:function(element)
    {
        let _self = this;
        $('#'+this._id).treeview({data: this._model.get("data") });
        if (_self.onselected)
            $('#'+this._id).on('nodeSelected', function(ev,data)
            {
                _self.onselected.call(_self.onselected,ev,data)
            });
    },
    exec:function(_method,options)
    {
        return $('#'+this._id).treeview(_method,options);
    },
    reset:function()
    {
        this.onrender();
    }
});    
