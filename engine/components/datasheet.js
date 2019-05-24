var datasheet = component.extend({
    init:function(_options = {},_model) 
    {
        var header = _options.header || "";
        var bodyStyle = _options.bodyStyle || "";
        var tableStyle = _options.tableStyle || "";
        var  _view = new view(`
            
            <table id="${_options.id}" class="table  ${_options.cls} fixed_header" en-bind="${_options.dataBind}" style="${tableStyle}">
                <thead>
                    ${header}
                </thead>
                <tbody en-output="${_options.id}" style="${bodyStyle}">
                </tbody>
            </table>
            `);
        if (!_model)
            _model = new model ({ 
                data: _options.data 
            });
        this.cloneProperties = ['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
					  'text-align', 'font', 'font-size', 'font-family', 'font-weight',
					  'border', 'border-top', 'border-bottom', 'border-left', 'border-right'];
					  
        this.selectCls = _options.selectCls || "";
        this.noedit = _options.noedit;
        this._super(_model,_view,_options);
    },
    _onrender:function()
    {
        try
        {
            var _self = this;
            if (!_self.editor) _self.editor =  $(`<input id="${_self._id}-input">`);
            $delay(1000,function()
            {
                var e =  $(`#${_self._id}-input`);
                if (e.length == 0)
                {
                    _self.editor.css('position', 'absolute').hide().appendTo(_self.getContainer().parent());
                    _self.editor.blur(function (evt) 
                    {
                        console.log("blur");
            			var text = _self.editor.val();
                        var row = $(_self.active).parent("tr").data("index");
                        var col = $(_self.active).data("col");
    
            			_self.onchange(row,col,text,_self.active);
            			_self.editor.hide();
            			evt.stopPropagation();
            		})
                }
                $('#'+_self._id +' td').off('click');
                $('#'+_self._id +' td').on('click', function(evt) 
                {
          			evt.stopPropagation();
                    var el = evt.currentTarget
                    var parent = $(el).parent();
                    var col = $(el).data("col");
                    var noedit = $(el).attr('noedit');
                    var row = $(parent).data("index");

                    // remove old selection
                    $(parent).parent().find("tr"). removeClass(_self.selectCls);
                    // add new selection
                    $(parent).addClass(_self.selectCls);
                    
                    if (_self.onclick(row,col,el) === false || _self.noedit || typeof noedit !== typeof undefined) return;
                    
                    if (_self.canEdit(row,col) === false) return;
                     
                    _self.active = $(el);         
   					_self.editor.val(_self.active.text())
						.removeClass('error')
						.show()
						.offset(_self.active.offset())
						.css( _self.active.css(_self.cloneProperties))
						.width(_self.active.width())
						.height(_self.active.height())
						.focus();
                });
                $('#'+_self._id +' tbody').on('scroll', function(evt) 
                {
                    _self.onscroll(evt);
                });
            });
        }
        catch(e)
        {
            alert(e.message);
        }
    },
    refresh:function()
    {
        var _self = this;
        $('#'+_self._id +' td').off('click');
        $('#'+_self._id +' td').on('click', function(evt) 
        {
              evt.stopPropagation();
            var el = evt.currentTarget
            var parent = $(el).parent();
            var col = $(el).data("col");
            var noedit = $(el).attr('noedit');
            var row = $(parent).data("index");

            // remove old selection
            $(parent).parent().find("tr"). removeClass(_self.selectCls);
            // add new selection
            $(parent).addClass(_self.selectCls);

            if (_self.onclick(row,col,el) === false || _self.noedit || typeof noedit !== typeof undefined) return;
            
            if (_self.canEdit(row,col) === false) return;
             
            _self.active = $(el);         
               _self.editor.val(_self.active.text())
                .removeClass('error')
                .show()
                .offset(_self.active.offset())
                .css( _self.active.css(_self.cloneProperties))
                .width(_self.active.width())
                .height(_self.active.height())
                .focus();
        });
        $('#'+_self._id +' tbody').on('scroll', function(evt) 
        {
            _self.onscroll(evt);
        });
    },
    _ondatachange:function(prop,value,data)
    {
        this.refresh();
    },
    onclick:function(row,col)
    {
    },
    onscroll:function(evt)
    {
    },
    onchange:function(index,col,newValue)
    {
    },
    canEdit:function(row,col)
    {
    },
    afterDataRender:function()
    {
        this._onrender();
        return '';
    },
    showDetails(rowElement,sContent) 
    {
        var next = $(rowElement).next('tr');
        
        if (next.length == 1)
        {
            if ($(next).data("role") == "details")
            {
                $(next).remove();
                return;
            }
        }
        var cols = $(rowElement).find('td').length;
        $(rowElement).after(`<tr data-role='details' ><td colspan=${cols}>${sContent}</td></tr>`);    
    },
    search:function(sText)
    {
        this.filter = sText;
        this.refreshData();
    },
    applyFilter(objJSON)
    {
        var _self = this,ok = false;
        if (!this.filter) return true;
        Object.keys(objJSON).forEach(function(key) 
        {
            var val = objJSON[key];
            if (stripos(val,_self.filter) !== false) ok = true;
        });
        return ok;
    }
});