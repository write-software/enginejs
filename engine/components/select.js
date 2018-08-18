var select = component.extend({
    init:function(options = {},_model) 
    {
        this.selected = "";
        this.selectedIndex = -1;
        let _options = {};
        options.text = options.text || "";
        options.className = options.className || "";
        options.multiple =  options.multiple ? 'multiple' : '';
        options.data =  options.data || [];
        options.dataBind = options.dataBind || "data";
        options.dataUpdate = options.dataUpdate || "";    
        if (!_model)
            _model = new model ({ 
                text: options.text,
                className: options.className, 
                data: options[options.dataBind] 
            });
        let html = `
        <div class="form-group">
            <template en-template="${options.dataBind}">
                <option id="{id}" value="{value}">{text}</option>
            </template>
            <select id='${options.id}-list'class="form-control" ${options.multiple} data-type="component" en-bind="${options.dataBind}" en-update="${options.dataUpdate}">
            </select>
        </div>`;
        let _view = new view(html);
        _options.id = options.id;        
        _options.methods = options.methods;
        this._super(_model,_view,_options);
        this.dataBind = options.dataBind;
        this.dataUpdate = options.dataUpdate;
        this.multiple = options.multiple;
    },
    onrender:function(element)
    {
        let _self = this;
        $(element).on("changed.bs.select",
            function(ev, clickedIndex, newValue, oldValue) 
            {
                let sSelected = $(_self._view._element).find('select:not(.ms)').selectpicker('val') || "";
                if (_self.multiple == "multiple" && sSelected.length > 0)
                {      
                    if (sSelected[0] == "")
                    {
                        sSelected = "";
                        _self.deselectAll();
                    }
                    else
                    {
                        sSelected = sSelected.join(",");
                        if (sSelected.substr(0,1) == ",") sSelected = sSelected.substr(1);
                    }              
                }
                if (sSelected == "{value}")
                {
                    sSelected = _self._model.get(_self.dataBind)[clickedIndex];
                    sSelected = sSelected.value;
                }
                try{
                    _self.onselected(sSelected,clickedIndex, ev);
                }
                catch(e)
                {
                    
                }
            });    
    },
    _ondatachange:function(prop,value,data)
    {
        if (prop == this.dataUpdate)
            this.select(value)
    },
    getSelected:function()
    {
        return this.selected;
    },
    getSelectedIndex:function()
    {
        return this.selectedIndex;
    },
    deselectAll:function()
    {
        $(this._view._element).find('select:not(.ms)').selectpicker('deselectAll');
    },
    selectAll:function()
    {
        $(this._view._element).find('select:not(.ms)').selectpicker('selectAll');
    },
    select:function(_value)
    {
        if (_value == null) return;
        var _self = this;
        var data = this._model.getData()[this.dataBind];
        if (_self.multiple)
        {
            var index = 0;
             _self.selected = [];
            $.each(data,function(key,value)
            {
                var v = data[key];
                if (v.value == null) v.value = v.text;
                if ((_value+",").indexOf(v.value+",") != -1)
                {
                    if (_value == "" && v.value == "")
                    {
                        _self.selected.push(_value);
                    }
                    else if (v.value != "") 
                    {
                        _self.selected.push(v.value);
                    }
                }
                index++;
            });
            $(_self._view._element).find('select:not(.ms)').selectpicker('val',_self.selected);
        }
        else
            $(_self._view._element).find('select:not(.ms)').selectpicker('val',_value);
        $(_self._view._element).find('select:not(.ms)').selectpicker('refresh');
    }
});    
