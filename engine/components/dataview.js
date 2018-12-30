var dataView = component.extend({
    init:function(options = {},_model) 
    {
        let _options = {};
        options.text = options.text || "";
        options.className = options.className || "";
        options.data =  options.data || [];
        options.dataBind = options.dataBind || "data";
        options.cls = options.cls || "dataview";
        options.style = options.style || "";
        let html = `<div id='${options.id}' class='${options.cls}' en-bind="${options.dataBind}" style='${options.style}'></div>`;
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
    },
    setSelected:function(idx)
    {
        $(this.getContainer()).find(".card").removeClass("dataview-select");
        $(this.getContainer()).find('[en-index="' + idx + '"]').addClass("dataview-select");
        this._model.set("selected",idx);
    }
});    

