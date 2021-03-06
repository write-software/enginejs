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
        options.cls = options.cls || "";
        options.style = options.style || "";
        options.size = options.size || "auto";
        options.header = options.header || "";    
        options.dataUpdate = options.dataUpdate || "";    
        options.optionValue = options.optionValue || "value";
        options.optionText = options.optionText || "text";
        options.liveSearch = options.liveSearch ? "true" : "false";
        if (!_model)
            _model = new model ({ 
                text: options.text,
                className: options.className, 
                data: options[options.dataBind] 
            });
        let html = `
        <div class="form-group ${options.cls}" style="${options.style}">
            <template en-template="${options.dataBind}">
                <option id="{id}" value="{${options.optionValue}}">{${options.optionText}}</option>
            </template>
            <select id="${options.id}-list" class="selectpicker" ${options.multiple} data-live-search="${options.liveSearch}" data-size="${options.size}" data-width="100%" data-header="${options.header}" data-type="component" en-bind="${options.dataBind}" en-update="${options.dataUpdate}">
            </select>
        </div>`;
        let _view = new view(html);
        _options.id = options.id;        
        _options.methods = options.methods;
        this._super(_model,_view,_options);
        this.optionText = options.optionText;
        this.optionValue = options.optionValue;
        this.dataBind = options.dataBind;
        this.dataUpdate = options.dataUpdate;
        this.liveSearch = options.liveSearch;
        this.multiple = options.multiple;
    },
    onrender:function(element)
    {
        let _self = this;
        $(element).on("changed.bs.select",
            function(ev, clickedIndex, newValue, oldValue) 
            {
                let sSelected = $(_self._view._element).find('select:not(.ms)').selectpicker('val') || "";
                if (typeof clickedIndex == "undefined") clickedIndex = this.selectedIndex;
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
                    if (_self.dataUpdate)
                    {
                        // model:property
                        var p = _self.dataUpdate.indexOf(":");   
                        if (p != -1)
                        {
                            var sModel = _self.dataUpdate.substr(0,p);
                            var sProp = _self.dataUpdate.substr(p+1);
                            var m = $engine.getModel(sModel);
                            if (m)
                            {
                                try
                                {
                                    m.set(sProp,sSelected);    
                                }
                                catch(e)
                                {
                                    _self.log(e.message);
                                }
                            }
                        }
                    }
                    if (typeof clickedIndex != "undefined") _self.onselected(sSelected,clickedIndex, ev);
                }
                catch(e)
                {
                    
                }
            });    
        $(element).find('select:not(.ms)').selectpicker('refresh');
    },
    _ondatachange:function(prop,value,data)
    {
        if (prop == this.dataUpdate)
            this.select(value)
        else if (prop == "prop" || prop == this.dataBind)
            this.refresh();
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
        if (_value == null) 
        {
            $(this._view._element).find('select:not(.ms)').val('');
            $(this._view._element).find('select:not(.ms)').selectpicker("refresh");
            return;
        }
        var _self = this;
        var m = this.getModel();
        var clickedIndex = -1;
        if (!_self.multiple)
        {
            if ((clickedIndex = m.search(this.dataBind,this.optionValue,_value)) == -1) 
            {
                if ((clickedIndex = m.search(this.dataBind,this.optionText,_value)) == -1) 
                {
                    $(this._view._element).find('select:not(.ms)').val('');
                    $(this._view._element).find('select:not(.ms)').selectpicker("refresh");
                    return;
                }
            }    
        }
        var data = m.getData()[this.dataBind];
        if (_self.multiple)
        {
            var index = 0;
             _self.selected = [];
            $.each(data,function(key,value)
            {
                var v = data[key];
                if (v[_self.optionValue] == null) v[_self.optionValue] = v[_self.optionText];
                if ((_value+",").indexOf(v[_self.optionValue] +",") != -1)
                {
                    if (_value == "" && v[_self.optionValue] == "")
                    {
                        _self.selected.push(_value);
                    }
                    else if (v[_self.optionValue]  != "") 
                    {
                        _self.selected.push(v[_self.optionValue] );
                    }
                }
                index++;
            });
            $(_self._view._element).find('select:not(.ms)').selectpicker('val',_self.selected);
        }
        else if (_value)
            $(_self._view._element).find('select:not(.ms)').selectpicker('val',_value);
        else
        {
            $(this._view._element).find('select:not(.ms)').val('default');
            $(this._view._element).find('select:not(.ms)').selectpicker("refresh");
        }
        $(_self._view._element).find('select:not(.ms)').selectpicker('refresh');
        _self.onselected(_value,clickedIndex);
    },
    reset:function()
    {
        $(this._view._element).find('select:not(.ms)').selectpicker('deselectAll');
    },
    refresh:function()
    {
        $(this._view._element).find('select:not(.ms)').selectpicker('refresh');
    }
});    
