var listgroup = component.extend({
    init:function(options = {},_model) 
    {
        let _options = {};
        options.text = options.text || "";
        options.className = options.className || "";
        options.data =  options.data || [];
        options.dataBind = options.dataBind || "data";
        let html = `<ul id="${options.id}" class="list-group ${this.className}"  en-bind="${options.dataBind}">
            <template en-template="${options.dataBind}">
                <li  id="{id}" class="list-group-item {className}" data-index="{index}" en-click="onclick">{text}</li>
            </template>
            <output/>
        </ul>`;
        let _view = new view(html);
        if (!_model)
            _model = new model ({ 
                text: options.text,
                className: options.className, 
                data: options.data 
            });
        _options.id = options.id;
        _options.methods = options.methods;
        this.dataBind = options.dataBind;
        this._super(_model,_view,_options);
    },
    onclick:function(ev)
    {
        
        if (this.hasOwnProperty("onselected"))
        {
            var clickedIndex = $(ev.target).attr("data-index");
            selected = this._model.get(this.dataBind)[clickedIndex];
            this.onselected(selected,clickedIndex, ev);
        } 
    }
});   
