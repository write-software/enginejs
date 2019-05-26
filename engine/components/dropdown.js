var dropdown = component.extend({
    init:function(options = {},_model) 
    {
        let _options = {};
        options.text = options.text || "";
        options.compClass = options.compClass || "";
        options.className = options.className || "btn-primary";
        options.data =  options.data || [];
        options.dataBind = options.dataBind || "data";
        let html = `
        <div class="${options.compClass}">
            <template en-template="${options.dataBind}">
                <li class="dropdown-item">
                    <a href="javascript:void(0);">
                        <div class="menu-info" id="{id}" data-value="{value}" >
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
        $(this.getContainer()).find('.menu-info').on('click',function(evt) {
            _self.setText($(this).text().trim());
            _self.onselected($(this).text().trim(),$(this).attr("data-value"),evt);
        }); 
    },
    ondatachange:function(prop)
    {
        if (prop == this.dataBind)
        {
            var _self = this;
            $(this.getContainer()).find('.menu-info').on('click',function(evt) {
                _self.onselected($(this).text().trim(),$(this).attr("data-value"),evt);
            });     
        }
    },
    setText:function(sText)
    {
        let el = this.getContainer();
        $(el).find("button").html(sText);
    },
    onselected:function()
    {

    }
})   