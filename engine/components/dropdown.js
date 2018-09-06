var dropdown = component.extend({
    init:function(options = {},_model) 
    {
        let _options = {};
        options.text = options.text || "";
        options.className = options.className || "btn-primary";
        options.data =  options.data || [];
        options.dataBind = options.dataBind || "data";
        let html = `
        <div>
            <template en-template="${options.dataBind}">
                <li class="dropdown-item">
                    <a href="javascript:void(0);">
                        <div class="menu-info" id="{id}" >
                            {text}
                        </div>
                    </a>
                </li>
            </template>
            <button class="btn ${options.className} dropdown dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${options.text}
            </button>
            <ul class="dropdown-menu" en-bind="${options.dataBind}">
            </ul>
        </div>`;
        let _view = new view(html);
        if (!_model)
            _model = new model ({ 
                text: options.text,
                className: options.className, 
                data: options[options.dataBind] 
            });
        _options.id = options.id;
        _options.methods = options.methods;
        this._super(_model,_view,_options);
        this.dataBind = options.dataBind;
    },
    _onrender:function()
    {
        var _self = this;
        $(this.getContainer()).find('.menu-info').on('click',function() {
            _self.onselected($(this).text().trim());
        }); 
    },
    onselected:function()
    {

    }
})   