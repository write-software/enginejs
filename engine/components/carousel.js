var carousel = component.extend({
    init:function(options = {},_model) 
    {
        let _options = {};
        options.text = options.text || "";
        options.className = options.className || "";
        options.data =  options.data || [];
        options.dataBind = options.dataBind || "data";
        options.cls = options.cls || "";
        let html = `
                <div id="${options.id}" class="carousel slide ${options.cls}" data-ride="carousel">
                <!-- Indicators -->
                <ol class="carousel-indicators">
                    <li data-target="#${options.id}'" data-slide-to="0" class="active"></li>
                    <li data-target="#${options.id}'" data-slide-to="1"></li>
                    <li data-target="#${options.id}'" data-slide-to="2"></li>
                </ol>

                <!-- Wrapper for slides -->
                <div class="carousel-inner" role="listbox" en-bind="${options.dataBind}">
                </div>

                <!-- Controls -->
                <a class="left carousel-control" href="#${options.id}" role="button" data-slide="prev">
                    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="right carousel-control" href="#${options.id}" role="button" data-slide="next">
                    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        `;
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
