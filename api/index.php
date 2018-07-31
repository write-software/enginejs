<?php

session_start();
error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );

include_once "./classes/apiClass.php";
include_once "./classes/dbClass.php";
include_once "./config.php";
require('UploadHandler.php');

function stdout ($msg)
{
    echo $msg . "<br>";
}

class myAPIs extends baseAPIClass
{
    var $dbname = "";

    public function init()
    {
        // Prep the database name here
        
        $this->dbname = "enginejs";
        return true;
    }
    //-----------------------------------------------------------------------------    
    public function generateID($length) 
    {     
        $length = $length | 10;                      
        $constants = 'ABCDEFGHJLMNPQRSTVWYXZ23456789';
        $code = '';
        for ($i = 0; $i < $length; $i++) 
        {
            $idx = mt_rand (0,strlen($constants));
            $code .= substr($constants,$idx,1);
        }
        return $code;
    }    
    //-----------------------------------------------------------------------------    
    public function categorys_get()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $sql = "select fdCategory as text from tbcategory";
        if ($db->query($sql))
        {
            $result = "[]";
            $st = microtime(true);
            if ($db->fetchrow(true))
                $result =  json_encode($db->row);                
            $et = microtime(true);
            $diff = $et - $st;
            $this->pushResult("result",$result);
        }
        else
            $this->error('Query Failed ' . $error);
        $this->pushResult("result",$result);
    }
    //-----------------------------------------------------------------------------    
    public function products_get()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $sql = "select * from tbproducts order by fdCategory";
        if ($db->query($sql))
        {
            $result = "[]";
            $st = microtime(true);
            if ($db->fetchrow(true))
                $result =  json_encode($db->row);                
            $et = microtime(true);
            $diff = $et - $st;
            $this->pushResult("result",$result);
        }
        else
            $this->error('Query Failed ' . $error);
        $this->pushResult("result",$result);
    }
    //-----------------------------------------------------------------------------    
    public function products_add()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $guid = $this->guid();
        $cat = $this->getParam("category");
        $prodid = $this->getParam("prodid");
        $name = $this->getParam("name");
        $desc = $this->getParam("desc");
        $image = $this->getParam("image");
        if ($image == "") $image = "data:image/png;base64,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";
        $dt = date("YmdHis");
        $sql = "insert into tbproducts values('$guid','$cat','$id','$name','$desc',0,'$dt','$image')";
        $db->execute($sql);
        if ($db->lastError() != "")
        {
            $this->error("Failed To Add : " . $db->lastError());
            return;
        }        
        $sql = "select * from tbproducts order by fdCategory";
        if ($db->query($sql))
        {
            $result = "[]";
            $st = microtime(true);
            if ($db->fetchrow(true))
                $result =  json_encode($db->row);                
            $et = microtime(true);
            $diff = $et - $st;
            $this->pushResult("result",$result);
        }
        else
            $this->error('Query Failed ' . $error);
        $this->pushResult("result",$result);
    }
    //-----------------------------------------------------------------------------    
    public function products_update()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $guid = $this->getParam("guid");
        $cat = $this->getParam("category");
        $prodid = $this->getParam("prodid");
        $name = $this->getParam("name");
        $desc = $this->getParam("desc");

        $sql = "update tbproducts set fdCategory='$cat', fdProdID='$prodid',fdName='$name',fdDesc='$desc' where fdGUID = '$guid'";
        $db->execute($sql);
        if ($db->lastError() != "")
        {
            $this->error("Failed To Update : " . $db->lastError());
            return;
        }        
        
        $sql = "select * from tbproducts order by fdCategory";
        if ($db->query($sql))
        {
            $result = "[]";
            $st = microtime(true);
            if ($db->fetchrow(true))
                $result =  json_encode($db->row);                
            $et = microtime(true);
            $diff = $et - $st;
            $this->pushResult("result",$result);
        }
        else
            $this->error('Query Failed ' . $error);
        $this->pushResult("result",$result);
    }
    //-----------------------------------------------------------------------------    
    public function products_setimage()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $guid = $this->getParam("guid");
        $image = $this->getParam("image");
        if ($image == "") $image = "data:image/png;base64,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";

        $sql = "update tbproducts set fdImage='$image' where fdGUID = '$guid'";
        $db->execute($sql);
        if ($db->lastError() != "")
        {
            $this->error("Failed To Update : " . $db->lastError());
            return;
        }
    }        
    //-----------------------------------------------------------------------------    
    public function products_remove()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $guid = $this->getParam("id");

        $sql = "delete from tbproducts where fdGUID = '$guid'";
        $db->execute($sql);
        if ($db->lastError() != "")
        {
            $this->error("Failed To Update : " . $db->lastError());
            return;
        }        
        $sql = "delete from tbhistory where fdStockID = '$guid'";
        $db->execute($sql);
        
        $sql = "select * from tbproducts order by fdCategory";
        if ($db->query($sql))
        {
            $result = "[]";
            $st = microtime(true);
            if ($db->fetchrow(true))
                $result =  json_encode($db->row);                
            $et = microtime(true);
            $diff = $et - $st;
            $this->pushResult("result",$result);
        }
        else
            $this->error('Query Failed ' . $error);
        $this->pushResult("result",$result);
    }
    //-----------------------------------------------------------------------------    
    public function history_get()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $id = $this->getParam("guid");
        $sql = "select * from tbhistory where fdStockID = '$id' order by fdDateTime DESC";
        if ($db->query($sql))
        {
            $result = "[]";
            $st = microtime(true);
            if ($db->fetchrow(true))
                $result =  json_encode($db->row);                
            $et = microtime(true);
            $diff = $et - $st;
            $this->pushResult("result",$result);
        }
        else
            $this->error('Query Failed ' . $error);
        $this->pushResult("result",$result);
    }
    //-----------------------------------------------------------------------------    
    public function history_add()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $id = $this->getParam("guid");
        $qty = $this->getParam("qty");
        $comment = $this->getParam("comment");

        $guid = $this->guid();
        $dt = date("YmdHis");
        $sql = "insert tbhistory value ('$guid','$id','$dt','$qty','$comment','IN')";
        $db->execute($sql);
        if ($db->lastError() != "")
        {
            $this->error("Failed To Update : " . $db->lastError());
            return;
        }        
        $sql = "update tbproducts set fdQty = fdQty + $qty where fdGUID = '$id'";
        $db->execute($sql);
        
        $sql = "select * from tbhistory where fdStockID = '$id' order by fdDateTime DESC";
        if ($db->query($sql))
        {
            $result = "[]";
            $st = microtime(true);
            if ($db->fetchrow(true))
                $result =  json_encode($db->row);                
            $et = microtime(true);
            $diff = $et - $st;
            $this->pushResult("result",$result);
        }
        else
            $this->error('Query Failed ' . $error);
        $this->pushResult("result",$result);
    }
    //-----------------------------------------------------------------------------    
    public function history_remove()
    {
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        $id = $this->getParam("guid");
        $qty = $this->getParam("qty");
        $comment = $this->getParam("comment");

        $guid = $this->guid();
        $dt = date("YmdHis");
        $sql = "insert tbhistory value ('$guid','$id','$dt','$qty','$comment','OUT')";
        $db->execute($sql);
        if ($db->lastError() != "")
        {
            $this->error("Failed To Update : " . $db->lastError());
            return;
        }        
        $sql = "update tbproducts set fdQty = fdQty - $qty where fdGUID = '$id'";
        $db->execute($sql);
        
        $sql = "select * from tbhistory where fdStockID = '$id' order by fdDateTime DESC";
        if ($db->query($sql))
        {
            $result = "[]";
            $st = microtime(true);
            if ($db->fetchrow(true))
                $result =  json_encode($db->row);                
            $et = microtime(true);
            $diff = $et - $st;
            $this->pushResult("result",$result);
        }
        else
            $this->error('Query Failed ' . $error);
        $this->pushResult("result",$result);
    }
    public function signin()
    {
        $user = $this->getParam("user");
        $pwd = $this->getParam("pwd");
        $db = new dbClass();
        if (!$db->connect(_DBTYPE, _DBHOST, $this->dbname, _DBUSER, _DBPASS))
        {
            $this->error("DB Connect Failed");
            return;
        }
        if (stripos($user,"'") !== false || stripos($pwd,"'") !== false)
        {
            $this->error("Injection Attack");
            return;            
        }
        $sql = "select * from tbusers where fdUserID like '$user' AND fdPwd = '$pwd'"; 
        $this->writeFile("signin.txt",$sql);
        $db->query($sql);
        if ($db->fetchrow() == null)
        {
            $this->error("Invalid Login");
        }
    }
    public function products_setdatasheet()
    {
        $guid = $this->getParam("guid");   
        $files = @$_FILES["files"];  
        $this->appendFile("products_setdatasheet.txt","===============================");
        $this->appendFile("products_setdatasheet.txt","$guid");
        $upload_handler = new UploadHandler();

        $this->appendFile("products_setdatasheet.txt","BP1");
        foreach ($files as $index => $value) {
            $this->appendFile("products_setdatasheet.txt","FN:  $index $value");
        }
        exit();
    }
};
$apis = new myAPIs();
if ($apis->init())
    $apis->execute();
if ($apis->hasResults() && $apis->hasErrors() == 0) $apis->jsonResults();
if ($apis->hasErrors()) $apis->jsonErrors();

 
?>