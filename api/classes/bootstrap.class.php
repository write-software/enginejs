<?php

class bootstrapColClass {

    var $items = array();
    var $size = "md-12";
    var $class = "";
    var $content = "";
    
    function __construct($size,$class)
    {
        if ($size)
            $this->setSize($size);
        if ($class)
            $this->setClass($class);
    }

    public function setClass($class)
    {
        $this->class = $class;
    }
           
    public function setSize($size)
    {
        $this->size = "md-" . $size;
    }
           
    public function addContent($html)
    {
        $this->content .= $html;
    }

    public function addDiv($class,$content)
    {
        $this->addContent("<div class=\"$class\">$content</div>");
    }
    
    public function addRow()
    {
        $row = new bootstrapRowClass();
        array_push($this->items,$row);
        return $row;
    }

    public function output()
    {
        $html = '<div class="col-' . $this->size . ' ' . $this->class . '">' . PHP_EOL;

        $html .= $this->content;
        foreach($this->items as $row)
        {
            $html .= $row->output();
        }

        $html .= '</div>' . PHP_EOL;
        return $html;
    }
}

class bootstrapRowClass {

    var $items = array();
    
    public function addCol($size,$class)
    {
        $col = new bootstrapColClass($size,$class);
        array_push($this->items,$col);
        return $col;
    }

    public function output()
    {
        $html = '<div class="row">' . PHP_EOL;
        foreach($this->items as $col)
        {
            $html .= $col->output();
        }
        $html .= '</div>' . PHP_EOL;
        return $html;
    }
}

class bootstrapClass {

    var $items = array();
    
    public function addRow()
    {
        $row = new bootstrapRowClass();
        array_push($this->items,$row);
        return $row;
    }
    public function output()
    {
        $html = "";
        foreach($this->items as $row)
        {
            $html .= $row->output();
        }
        return $html;
    }
}

?>