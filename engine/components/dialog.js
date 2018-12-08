var dialog = component.extend({
    init:function(options = {},_model) 
    {

        let _options = { buttons:{} };
        options.title = options.title || "";
        options.closeText = options.closeText || "Close";
        options.submitText = options.submitText || "Submit";

        options.header = options.header || "";
        options.body = options.body || "";
        options.size = options.size || "";
        options.footer = options.footer || `<button type="button" class="btn btn-danger" data-dismiss="modal">${options.closeText}</button><button type="button" class="btn btn-primary" en-click="submit" type="submit">${options.submitText}</button>`;
        _options.id = options.id;
        let html = `
          <div class="modal fade" id="${options.id}" role="dialog">
            <div class="modal-dialog ${options.size}">
            
              <!-- Modal content-->
              <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">${options.title}</h4>
                    <br>
                    ${options.header}
                </div>
                <div class="modal-body">
                    ${options.body}
                </div>
                <div class="modal-footer">
                    ${options.footer} 
                </div>
              </div>
              
            </div>
        `;
        let _view = new view(html);
        if (!_model)
            _model = new model ({ 
                text: options.text 
            });
        _options.methods = options.methods;
        _view.deferred = true;
        this._super(_model,_view,_options);
    },
    _onrender:function()
    {
        var _self = this;
        
        $('#'+_self._id).on('show.bs.modal', function () 
        {
            if (_self.onbeforeshow)
                _self.onbeforeshow.call(_self);
            $('#'+_self._id).trigger('focus');
            if (_self.onshow)
                _self.onshow.call(_self);
        });     
        $('#'+_self._id).on('hide.bs.modal', function () 
        {
            $('#'+_self._id).trigger('focus');
            if (_self.onhide)
                _self.onhide.call(_self);
        });    
        $('#'+_self._id).on('shown.bs.modal', function () 
        {
            _self.deferred = false;
            let el = this;                 
    		$delay(100, function ()
    		{
               _self.refreshData();
                $(el).find('input:enabled:visible:first').focus();
    		});
        });  
    },
    close:function()
    {
        $('#'+this._id).modal('hide');
    },
    show:function()
    {
        var _self = this;
        if (!this._view._element)
        {
            this.render('body',true).then(function()
            {
                $('#'+_self._id).modal('show');
            })
        }
        else
            $('#'+this._id).modal('show');
    },
    submit:function()
    {
        if (this.onsubmit) this.onsubmit.call(this);
    }
});    
