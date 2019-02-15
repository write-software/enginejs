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
        this._options = JSON.clone(options);
        this._super(_model,_view,_options);
    },
    setSelected:function(idx)
    {
        if (idx >= this.getModel().get(this._options.dataBind).length)
            return;
        $(this.getContainer()).find(".card").removeClass("dataview-select");
        $(this.getContainer()).find('[en-index="' + idx + '"]').addClass("dataview-select");   
        this._model.set("selected",idx);

        try
        {
            var position = $(this.getContainer()).find('[en-index="' + idx + '"]').position();
            var eh = $(this.getContainer()).find('[en-index="' + idx + '"]').innerHeight();
            var top = $(this.getContainer()).scrollTop();
            var h = $(this.getContainer()).innerHeight();
            if (position.top + eh > top + h)
            {
                var dx = (position.top + eh) - (top + h);
                top += dx;
                $(this.getContainer()).scrollTop(top);
            }
        }
        catch(e)
        {

        }
    }
});    

