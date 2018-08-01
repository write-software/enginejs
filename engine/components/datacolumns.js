var dataColumns = component.extend({
    init:function(options = {},_model) 
    {
        let _options = {};
        options.data =  options.data || [];
        options.dataBind = options.dataBind || "data";
        options.cls = options.cls || "datacolumns";
        options.columns = options.columns || 1;
        let sColumns = "";
        let size = 12/options.columns;
        for (let i = 0;i < options.columns;i++)
        {
            sColumns += `<div class="col-xs-${size}" en-column="${i}"></div>`;
        }
        let html = `<div id='${options.id}' class='row ${options.cls}'>${sColumns}</div>`;
        let _view = new view(html);
        if (!_model)
            _model = new model ({ 
                text: options.text,
                className: options.className, 
                data: options.data 
            });
        _options.id = options.id;
        _options.methods = options.methods;
        this._super(_model,_view,_options);
    }
});    

