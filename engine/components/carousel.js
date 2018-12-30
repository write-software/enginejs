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
                <div id="${options.id}" class="carousel slide ${options.cls}" data-ride="carousel" data-interval="false">
                <!-- Indicators -->
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
        this._index = 0;
        this._super(_model,_view,_options);
    },
    onrender:function(element)
    {
        let _self = this;
        $(element).on("touchstart", function(event){
            var xClick = event.originalEvent.touches[0].pageX;
            $(this).one("touchmove", function(event){
                var xMove = event.originalEvent.touches[0].pageX;
                if( Math.floor(xClick - xMove) > 5 ){
                    $(this).carousel('next');
                }
                else if( Math.floor(xClick - xMove) < -5 ){
                    $(this).carousel('prev');
                }
            });
            $(".carousel").on("touchend", function(){
                    $(this).off("touchmove");
            });
        });
        $(element).carousel('pause');
        $(element).on('slide.bs.carousel',function(e){
            var slideFrom = $(this).find('.active').index();
            var slideTo = $(e.relatedTarget).index();
            _self._index = slideTo;
            if (_self.onslide) _self.onslide.call(_self)
        });
    },
    getIndex()
    {
        return this._index;
    }
});    
