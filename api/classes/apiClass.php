<?php
///////////////////////////////////////////////////////////////////////////
//  Remote accessing
/* 
    The remote access allows other services to use the api on the same session.
    In this way a user can access a service on another server and by passing
    the remote ID and a token the service can all api's as if it were the 
    orginal users.
    
    This way a service could fetch a file, provide some services and write it
    back.
    
    WARNING: This service should be used with caution and any api's to be used
    remotely should be in a separate file or your api's should check that
    remote access is in use by calling the isRemote() function first.
    
    While this is highly risky the service must be instigated from the user
    in order to get the token, the access is only available while the session
    lasts and the api's must check for remote access.
    
    Finally once the service is complete the user service should change the
    token preventing any more access.
                     
*/
function remoteAccess()
{
    function getParam($sParam)
    {
        if (isset($_POST[$sParam]))
            return  $_POST[$sParam];
        else if (isset($_GET[$sParam]))
            return  $_GET[$sParam];
        else
            return "";
    };
    $remoteID = getParam("remoteid");
    if ($remoteID == "") return false;
    $token = getParam("token");
    if ($token == "") return false;
    session_id($remoteID);
    return true;
}
///////////////////////////////////////////////////////////////////////////
$remoting = remoteAccess();
session_start();
if ($remoting)
{
    // Make sure we go no further if tokens do not match.
    $token = getParam("token");
    $stoken = isset($_SESSION['token']) ? $_SESSION['token'] : "";
    if ($token != $stoken || $token == "")
    {
        echo "{ \"success\":false, \"error\":\"Access Denied\"}";
        exit();
    }
}
session_set_cookie_params(3600 * 24 * 7);
error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );
///////////////////////////////////////////////////////////////////////////
// API class
/*
    How to use:
    
    1. Create your own version of the apiClass by extending baseAPIClass
    
    2. add your functions
    
    3. call the execute function that uses the posted param  "command" to
       determine which function to call you can use namespace comamnds like
       system.test which will translated to ststem_test as the function.
       
       This way you can group your apis into more meaningful functions
       
    4. check for results and errors and call either jsonResults or  jsonErrors
       to echo back to the client.
       
example:
 
#include_once "apiClass.php";  

// Note this starts the session object so it should be the first include
   and you should not session_start again.
   
class myAPIs extends baseAPIClass
{
    public function version()
    {    
        $this->addToken(); 
        $this->addRemoteID(); 
        $this->pushResult("version","version\r\n'1.0.0'",false,true);
    }

    public function system_test()
    {  
        if (!$this->validToken())
        {
            $this->error("Access Denied");
        }
        else
        {
            if ($this->isRemote())
                $this->pushResult("test","myAPIs:HELLO REMOTE PERSON");
            else
                $this->pushResult("test","myAPIs:HELLO");
        }
    }
    
};
$apis = new myAPIs();

$apis->execute();
if ($apis->hasResults() && $apis->hasErrors() == 0) $apis->jsonResults();
if ($apis->hasErrors()) $apis->jsonErrors();
    

*/
///////////////////////////////////////////////////////////////////////////
// cross domain class

class xdClass
{
    /**
     * Curl handler
     * @access private
     * @var resource
     */
    var $ch ;

    /**
     * set debug to true in order to get usefull output
     * @access private
     * @var string
     */
    var $debug = false;

    /**
     * Contain last error message if error occured
     * @access private
     * @var string
     */
    var $error_msg;


    /**
     * Curl_HTTP_Client constructor
     * @param boolean debug
     * @access public
     */
    function __construct($debug = false)
    {
        $this->debug = $debug;
        $this->init();
    }
    
    function __destruct() 
    {
        foreach ($this as $index => $value) unset($this->$index);
    }

    /**
     * Init Curl session     
     * @access public
     */
    function init()
    {
        // initialize curl handle
        $this->ch = curl_init();

        //set various options

        //set error in case http return code bigger than 300
        curl_setopt($this->ch, CURLOPT_FAILONERROR, true);

        // allow redirects
        curl_setopt($this->ch, CURLOPT_FOLLOWLOCATION, true);
        
        // use gzip if possible
        curl_setopt($this->ch,CURLOPT_ENCODING , 'gzip, deflate');

        // do not veryfy ssl
        // this is important for windows
        // as well for being able to access pages with non valid cert
        curl_setopt($this->ch, CURLOPT_SSL_VERIFYPEER, 0);
        
        curl_setopt($this->ch, CURLOPT_CAINFO, dirname(__FILE__)."/cacert.pem"); 

    }

    /**
     * Set username/pass for basic http auth
     * @param string user
     * @param string pass
     * @access public
     */
    function set_credentials($username,$password)
    {
        curl_setopt($this->ch, CURLOPT_USERPWD, "$username:$password");
    }

    /**
     * Set referrer
     * @param string referrer url 
     * @access public
     */
    function set_referrer($referrer_url)
    {
        curl_setopt($this->ch, CURLOPT_REFERER, $referrer_url);
    }

    /**
     * Set client's useragent
     * @param string user agent
     * @access public
     */
    function set_user_agent($useragent)
    {
        curl_setopt($this->ch, CURLOPT_USERAGENT, $useragent);
    }

    /**
     * Set to receive output headers in all output functions
     * @param boolean true to include all response headers with output, false otherwise
     * @access public
     */
    function include_response_headers($value)
    {
        curl_setopt($this->ch, CURLOPT_HEADER, $value);
    }


    /**
     * Set proxy to use for each curl request
     * @param string proxy
     * @access public
     */
    function set_proxy($proxy)
    {
        curl_setopt($this->ch, CURLOPT_PROXY, $proxy);
    }



    /**
     * Send post data to target URL  
     * return data returned from url or false if error occured
     * @param string url
     * @param mixed post data (assoc array ie. $foo['post_var_name'] = $value or as string like var=val1&var2=val2)
     * @param string ip address to bind (default null)
     * @param int timeout in sec for complete curl operation (default 10)
     * @return string data
     * @access public
     */
    function send_post_data($url, $postdata, $ip=null, $timeout=10)
    {
        //set various curl options first

        // set url to post to
        curl_setopt($this->ch, CURLOPT_URL,$url);

        // return into a variable rather than displaying it
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER,true);

        //bind to specific ip address if it is sent trough arguments
        if($ip)
        {
            if($this->debug)
            {
                echo "Binding to ip $ip\n";
            }
            curl_setopt($this->ch,CURLOPT_INTERFACE,$ip);
        }

        //set curl function timeout to $timeout
        curl_setopt($this->ch, CURLOPT_TIMEOUT, $timeout);

        //set method to post
        curl_setopt($this->ch, CURLOPT_POST, true);


        //generate post string
        $post_array = array();
        if(is_array($postdata))
        {       
            foreach($postdata as $key=>$value)
            {
                $post_array[] = urlencode($key) . "=" . urlencode($value);
            }

            $post_string = implode("&",$post_array);

            if($this->debug)
            {
                echo "Url: $url\nPost String: $post_string\n";
            }
        }
        else 
        {
            $post_string = $postdata;
        }

        // set post string
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, $post_string);


        //and finally send curl request
        $result = curl_exec($this->ch);

        if(curl_errno($this->ch))
        {
            if($this->debug)
            {
                echo "Error Occured in Curl\n";
                echo "Error number: " .curl_errno($this->ch) ."\n";
                echo "Error message: " .curl_error($this->ch)."\n";
            }

            return false;
        }
        else
        {
            return $result;
        }
    }

    /**
     * fetch data from target URL    
     * return data returned from url or false if error occured
     * @param string url     
     * @param string ip address to bind (default null)
     * @param int timeout in sec for complete curl operation (default 5)
     * @return string data
     * @access public
     */
    function fetch_url($url, $ip=null, $timeout=5)
    {
        // set url to post to
        curl_setopt($this->ch, CURLOPT_URL,$url);

        //set method to get
        curl_setopt($this->ch, CURLOPT_HTTPGET,true);

        // return into a variable rather than displaying it
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER,true);

        //bind to specific ip address if it is sent trough arguments
        if($ip)
        {
            if($this->debug)
            {
                echo "Binding to ip $ip\n";
            }
            curl_setopt($this->ch,CURLOPT_INTERFACE,$ip);
        }

        //set curl function timeout to $timeout
        curl_setopt($this->ch, CURLOPT_TIMEOUT, $timeout);

        //and finally send curl request
        $result = curl_exec($this->ch);

        if(curl_errno($this->ch))
        {
            if($this->debug)
            {
                echo "Error Occured in Curl\n";
                echo "Error number: " .curl_errno($this->ch) ."\n";
                echo "Error message: " .curl_error($this->ch)."\n";
            }

            return false;
        }
        else
        {
            return $result;
        }
    }

    /**
     * Fetch data from target URL
     * and store it directly to file         
     * @param string url     
     * @param resource value stream resource(ie. fopen)
     * @param string ip address to bind (default null)
     * @param int timeout in sec for complete curl operation (default 5)
     * @return boolean true on success false othervise
     * @access public
     */
    function fetch_into_file($url, $fp, $ip=null, $timeout=5)
    {
        // set url to post to
        curl_setopt($this->ch, CURLOPT_URL,$url);

        //set method to get
        curl_setopt($this->ch, CURLOPT_HTTPGET, true);

        // store data into file rather than displaying it
        curl_setopt($this->ch, CURLOPT_FILE, $fp);

        //bind to specific ip address if it is sent trough arguments
        if($ip)
        {
            if($this->debug)
            {
                echo "Binding to ip $ip\n";
            }
            curl_setopt($this->ch, CURLOPT_INTERFACE, $ip);
        }

        //set curl function timeout to $timeout
        curl_setopt($this->ch, CURLOPT_TIMEOUT, $timeout);

        //and finally send curl request
        $result = curl_exec($this->ch);

        if(curl_errno($this->ch))
        {
            if($this->debug)
            {
                echo "Error Occured in Curl\n";
                echo "Error number: " .curl_errno($this->ch) ."\n";
                echo "Error message: " .curl_error($this->ch)."\n";
            }

            return false;
        }
        else
        {
            return true;
        }
    }

    /**
     * Send multipart post data to the target URL    
     * return data returned from url or false if error occured
     * (contribution by vule nikolic, vule@dinke.net)
     * @param string url
     * @param array assoc post data array ie. $foo['post_var_name'] = $value
     * @param array assoc $file_field_array, contains file_field name = value - path pairs
     * @param string ip address to bind (default null)
     * @param int timeout in sec for complete curl operation (default 30 sec)
     * @return string data
     * @access public
     */
    function send_multipart_post_data($url, $postdata, $file_field_array=array(), $ip=null, $timeout=30)
    {
        //set various curl options first

        // set url to post to
        curl_setopt($this->ch, CURLOPT_URL, $url);

        // return into a variable rather than displaying it
        curl_setopt($this->ch, CURLOPT_RETURNTRANSFER, true);

        //bind to specific ip address if it is sent trough arguments
        if($ip)
        {
            if($this->debug)
            {
                echo "Binding to ip $ip\n";
            }
            curl_setopt($this->ch,CURLOPT_INTERFACE,$ip);
        }

        //set curl function timeout to $timeout
        curl_setopt($this->ch, CURLOPT_TIMEOUT, $timeout);

        //set method to post
        curl_setopt($this->ch, CURLOPT_POST, true);

        // disable Expect header
        // hack to make it working
        $headers = array("Expect: ");
        curl_setopt($this->ch, CURLOPT_HTTPHEADER, $headers);

        // initialize result post array
        $result_post = array();

        //generate post string
        $post_array = array();
        $post_string_array = array();
        if(!is_array($postdata))
        {
            return false;
        }

        foreach($postdata as $key=>$value)
        {
            $post_array[$key] = $value;
            $post_string_array[] = urlencode($key)."=".urlencode($value);
        }

        $post_string = implode("&",$post_string_array);


        // set post string
        //curl_setopt($this->ch, CURLOPT_POSTFIELDS, $post_string);


        // set multipart form data - file array field-value pairs
        if(!empty($file_field_array))
        {
            foreach($file_field_array as $var_name => $var_value)
            {
                if(strpos(PHP_OS, "WIN") !== false) $var_value = str_replace("/", "\\", $var_value); // win hack
                $file_field_array[$var_name] = "@".$var_value;
            }
        }

        // set post data
        $result_post = array_merge($post_array, $file_field_array);
        curl_setopt($this->ch, CURLOPT_POSTFIELDS, $result_post);


        //and finally send curl request
        $result = curl_exec($this->ch);

        if(curl_errno($this->ch))
        {
            if($this->debug)
            {
                echo "Error Occured in Curl\n";
                echo "Error number: " .curl_errno($this->ch) ."\n";
                echo "Error message: " .curl_error($this->ch)."\n";
            }

            return false;
        }
        else
        {
            return $result;
        }
    }

    /**
     * Set file location where cookie data will be stored and send on each new request
     * @param string absolute path to cookie file (must be in writable dir)
     * @access public
     */
    function store_cookies($cookie_file)
    {
        // use cookies on each request (cookies stored in $cookie_file)
        curl_setopt ($this->ch, CURLOPT_COOKIEJAR, $cookie_file);
        curl_setopt ($this->ch, CURLOPT_COOKIEFILE, $cookie_file);
    }
    
    /**
     * Set custom cookie
     * @param string cookie
     * @access public
     */
    function set_cookie($cookie)
    {       
        curl_setopt ($this->ch, CURLOPT_COOKIE, $cookie);
    }

    /**
     * Get last URL info 
     * usefull when original url was redirected to other location   
     * @access public
     * @return string url
     */
    function get_effective_url()
    {
        return curl_getinfo($this->ch, CURLINFO_EFFECTIVE_URL);
    }

    /**
     * Get http response code    
     * @access public
     * @return int
     */
    function get_http_response_code()
    {
        return curl_getinfo($this->ch, CURLINFO_HTTP_CODE);
    }

    /**
     * Return last error message and error number
     * @return string error msg
     * @access public
     */
    function get_error_msg()
    {
        $err = "Error number: " .curl_errno($this->ch) ."\n";
        $err .="Error message: " .curl_error($this->ch)."\n";

        return $err;
    }
    
    /**
     * Close curl session and free resource
     * Usually no need to call this function directly
     * in case you do you have to call init() to recreate curl
     * @access public
     */
    function close()
    {
        //close curl session and free up resources
        curl_close($this->ch);
    }
    
    function compile_post_data($post_data)
    {
         $o="";
        if(!empty($post_data))
            foreach ($post_data as $k=>$v)
                $o.= $k."=".urlencode($v)."&";
        return substr($o,0,-1);
    }
    /**
     * Call Data Exchange
     * Handles both request information, fetch pocket attachments and adding a file to a pocket.     
     */
    function command($url,$post_data,$timeout)
    {
        $url = str_replace(" ","%20",$url);
        $useragent = "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)";
        $this->set_user_agent($useragent);
        $this->store_cookies("/tmp/cookies.txt");
        return $this->send_post_data($url, $post_data,null,$timeout);
    }

}

class Cipher {
    private $securekey, $iv;
    function __construct($key) {
        $this->securekey = hash('sha256',$key,TRUE);
        $iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB);
        $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
    }
    public function guid()
    {
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
               .substr($charid,20,12);
        return $uuid;
    }
    public function encrypt($text) {    
    
        $enc = mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $this->securekey, $this->guid() . "--" . $text, MCRYPT_MODE_ECB, $this->iv);
		return strtr(base64_encode($enc), '+/=', '-_~');
    }
    public function decrypt($text) {
		$text = strtr($text, '-_~', '+/=');
        $text = base64_decode($text);
        $crypttext = mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $this->securekey, $text, MCRYPT_MODE_ECB, $this->iv);
        $crypttext = rtrim($crypttext, "\0");   
        return $crypttext;
    }
}

class baseAPIClass
{
    private $_methods = array();
    private $errors = array();
    private $trace = false;
    private $results = array();
    private $xd;
     
    //--------------------------------------------------------------------------
    // Base functions

    function __construct()
    {
        $this->xd = new xdClass();
    }
    
    function __destruct() 
    {
        foreach ($this as $index => $value) unset($this->$index);
    }

    public function registerMethod($name,$code)
    {
        try
        {
            $this->_methods[$name] = $code;
            return true;
        }
        catch (Exception $e)
        {
            return false;
        }    
    }    
    public function getMethod($name)
    {
        try
        {
            return $this->_methods[$name];
        }
        catch (Exception $e)
        {
            return false;
        }    
    }    

    public function xdomain($url,$postdata,$timeout = 5)
    {
        if (isset($this->xd))
        {
            return $this->xd->command($url,$postdata,$timeout); 
        }
        return "NOT SET";
    }
    
    public function getParam($sParam)
    {
        if (isset($_POST[$sParam]))
            return  $_POST[$sParam];
        else if (isset($_GET[$sParam]))
            return  $_GET[$sParam];
        else
            return "";
    }

    public function isRemote()
    {
        global $remoting;
        return $remoting;
    }
    
    public function getSession()
    {
        return session_id();
    }
    
    public function validToken()
    {
        $token = $this->getParam("token");
        if (!isset($_SESSION['tokens'])) return false;
        foreach($_SESSION['tokens'] as $sToken)
        {
            if($sToken == $token)
                return true;
        }  
        return false;
    }

    public function guid()
    {
        $mtime = microtime();
        $p = strpos($mtime," ");
        return substr($mtime,$p+1) . "_" . substr($mtime,2,$p-2);
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
               .substr($charid,20,12);
        return $uuid;
    }
    
    public function encrypt($text, $key)
    {
        // $iv_size = mcrypt_get_iv_size(MCRYPT_XTEA, MCRYPT_MODE_ECB);
        // $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
    
        // $enc = mcrypt_encrypt(MCRYPT_XTEA, $key, $text, MCRYPT_MODE_ECB, $iv);
        // return base64_encode($enc);
        
        $levelOne = sha1($text);
        $levelTwo = md5($levelOne . $key . 1936);
        return $levelTwo;
    }

    public function decrypt($text, $key)
    {
        $iv_size = mcrypt_get_iv_size(MCRYPT_XTEA, MCRYPT_MODE_ECB);
        $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
        $text = base64_decode($text);
        $crypttext = mcrypt_decrypt(MCRYPT_XTEA, $key, $text, MCRYPT_MODE_ECB, $iv);
        $crypttext = rtrim($crypttext, "\0");   
        return $crypttext;
    }
    
    //--------------------------------------------------------------------------
    // folder functions

    public function is_emtpy_dir($dirname){
    
    // Returns true if  $dirname is a directory and it is empty
    
       $result=false;                      // Assume it is not a directory
       if(is_dir($dirname) ){
           $result=true;                   // It is a directory 
           $handle = opendir($dirname);
           while( ( $name = readdir($handle)) !== false){
                   if ($name!= "." && $name !=".."){ 
                 $result=false;        // directory not empty
                 break;                   // no need to test more
               }
           }
           closedir($handle);
       }
       return $result; 
    }
    
    public function rmkdir($path, $mode = 0777) 
    {
        $path = rtrim(preg_replace(array("/\\\\/", "/\/{2,}/"), "/", $path), "/");
        $e = explode("/", ltrim($path, "/"));
        if(substr($path, 0, 1) == "/") {
            $e[0] = "/".$e[0];
        }
        $c = count($e);
        $cp = $e[0];
        for($i = 1; $i < $c; $i++) {
            if(!is_dir($cp) && !@mkdir($cp, 0777)) {
                return false;
            }
            $cp .= "/".$e[$i];
        }
        return @mkdir($path, 0777);
    }
    
    public function appendFile($fn,$content)
    {
        if (!file_exists($fn)) return $this->writeFile($fn,$content);
        $fd = fopen($fn,'a+');
        if ($fd)
        {
            if (fwrite($fd, $content . "\r\n",strlen($content) + 2))    
            {
                fclose($fd);
                return true;
            }
            fclose($fd);
        }
        return false;
    }
    
    public function writeFile($fn,$content)
    {
        $fd = fopen($fn,'w+');
        if ($fd)
        {
            if (fwrite($fd, $content . "\r\n",strlen($content)+2))  
            {
                fclose($fd);
                return true;
            }
            fclose($fd);
        }
        return false;
    }

    //--------------------------------------------------------------------------
    // Error functions
    
    public function error($errmsg)
    {
        return array_push($this->errors,$errmsg);
    }
    
    public function echoErrors()
    {
        for($i = 0;$i < count($this->errors);$i++)
        {
            echo $this->errors[$i] . "<br>";
        }   
    }
    
    public function jsonErrors()
    {
        $resp = "{ \"success\":false, \"count\":" . count($this->errors) .", \"errors\":[";
        for($i = 0;$i < count($this->errors);$i++)
        {
            if ($i > 0 ) $resp .= ",";
            $resp .=  "{ \"error\": \"" . $this->errors[$i] . "\" }";
        } 
        $resp .= "] }";
        echo $resp;  
    }

    public function writeErrors($fn)
    {
        $sErrors = "";
        for($i = 0;$i < count($this->errors);$i++)
        {
            $sErrors .= $this->errors[$i] . "\r\n";
        }
        $this->writeFile($fn,$sErrors);   
    }
    
    public function hasUpperCase($fn)
    {
        for ($i = 0;$i < strlen($fn);$i++) if (substr($fn,$i,1) >= "A" && substr($fn,$i,1) <= "Z") return true; 
        return false;
    }
    
    public function clearErrors()
    {
        $this->errors = array();
    }
    
    public function hasErrors()
    {
        return count($this->errors) > 0 ? true : false;
    }

    //--------------------------------------------------------------------------
    // Result functions
    
    public function clearResults()
    {
        $this->results = array();
    }
    
    public function pushResult($key,$value,$encode = false,$htmlencode = false,$isJSON = false)
    {
        if ($encode)
            $this->results[$key] = urlencode($value);     
        else if ($htmlencode)
            $this->results[$key] = str_replace("\r\n","<br>",htmlspecialchars($value));     
        else if ($isJSON)
        {
            $value = str_replace("{'",'{"',$value);
            $value = str_replace("'}",'"}',$value);
            $value = str_replace("','",'","',$value);
            $value = str_replace("':'",'":"',$value);
            $value = str_replace("':",'":',$value);
            $value = str_replace(",'",',"',$value);
            $this->results[$key] = json_decode($value,true);     
        }
        else
            $this->results[$key] = $value;     
    }

    public function addRemoteID()
    {
        $this->results["remoteid"] = $this->getSession();     
    }

    public function addToken()
    {
        $cp = new Cipher('twssaas');
        $acc = $this->getParam("account");
        $pin = $this->getParam("pincode"); 
        $text = $acc."--".$pin;
	    if (!isset($_SESSION["tokens"])) $_SESSION["tokens"] = array();
        $token = $cp->encrypt($text);
        $dc = $cp->decrypt($token);
        array_push($_SESSION["tokens"], $token);
        $this->results["token"] = $token;
        return $token;
    }
    public function decodeToken()
    {
        if ($this->getParam("token") == "")
        {
            return "";     
        }
        $cp = new Cipher('twssaas');
        $token = $this->getParam("token");
        $token = str_replace(" ","+",$token);
        return $cp->decrypt($token);
    }

    public function decodeAccToken()
    {
        if ($this->getParam("acctoken") == "")
        {
            return "";     
        }
        $cp = new Cipher('twssaas');
        $token = $this->getParam("acctoken");
        $token = str_replace(" ","+",$token);
        return $cp->decrypt($token);
    }

    public function expandToken()
    {
        $token = $this->decodeToken();
        if ($token != "")
        {
            $p = stripos($token,"--");
            if ($p)
            {
                $code = substr($token,$p+2);
                $p2 = stripos($code,"--");
                if ($p2)
                {
                    $acc = substr($code,0,$p2);
                    $pin = substr($code,$p2+2);
                    $_POST['account'] = $acc; 
                    $_POST['pincode'] = $pin; 
                }                    
            }
        }    
    }

    public function jsonResults()
    {
        echo json_encode($this->results);
    }

    public function hasResults()
    {
        return count($this->results) > 0 ? true : false;
    }

    //--------------------------------------------------------------------------
    // Date functions
    
    public function weekNum()
    {
        return date("W");
    }

    public function formatDate($date)
    {
        $format = substr($date,6,2);
        $format .= "/";
        $format .= substr($date,4,2);
        $format .= "/";
        $format .= substr($date,0,4);
        return $format;
    }
    
    public function dateFormat($date,$format)
    {
        $y = intVal(substr($date,0,4));
        $mn = intVal(substr($date,4,2));
        $d = intVal(substr($date,6,2));
        $h = intVal(substr($date,8,2));
        $m = intVal(substr($date,10,2));
        $s = intVal(substr($date,12,2));
    
        $dt = mktime($h,$m,$s,$d,$mn,$y);
        return date($format,$dt);
    }
    
    public function formatDatetime($date)
    {
        if ($date == "")
            return "";
        $format = substr($date,6,2);
        $format .= "/";
        $format .= substr($date,4,2);
        $format .= "/";
        $format .= substr($date,0,4);
        $format .= "  ";
        $format .= substr($date,8,2);
        $format .= ":";
        $format .= substr($date,10,2);
        return $format;
    }
    
    public function todaysDate()
    {
        return date("YmdHis");
    }
    
    //--------------------------------------------------------------------------
    // general functions

    public function convertNulls($obj,$default)
    {
        if ($obj != null)
            return $obj;
        return $default;
    }
    
    public function generatePassword($length=9, $strength=0) 
    {
        $vowels = 'aeuy';
        $constants = 'bdghjmnpqrstvz';
        if ($strength & 1) {
            $constants .= 'BDGHJLMNPQRSTVWXZ';
        }
        if ($strength & 2) {
            $vowels .= "AEUY";
        }
        if ($strength & 4) {
            $constants .= '23456789';
        }
        if ($strength & 8) {
            $constants .= '@#$%';
        }
     
        $password = '';
        $alt = time() % 2;
        for ($i = 0; $i < $length; $i++) {
            if ($alt == 1) {
                $password .= $constants[(rand() % strlen($constants))];
                $alt = 0;
            } else {
                $password .= $vowels[(rand() % strlen($vowels))];
                $alt = 1;
            }
        }
        return $password;
    }
    
    ///////////////////////////////////////////////////////////////////////////
    // main api execute command
    
    public function execute()
    {
        try 
        {
            $this->clearErrors();
            $this->clearResults();
            $this->pushResult("success",true);
            $command = $this->getParam("command");
            $command = strToLower($command);
            $command = str_replace(".","_",$command);
			if(strpos($command,'?') !== false) {
				$opts = explode('?',$command);
				$command = $opts[0];
				$get = explode('=',$opts[1]);
				$_GET[$get[0]] = $get[1];
			}
            $classMethods = get_class_methods("baseAPIClass");
            foreach ($classMethods as $method_name) 
            {
                if (strToLower($method_name) == $command)
                {
                    $this->error("Access Denied");
                    return;
                }
            }
            if(method_exists($this,$command))
            {
                $this->$command();       
            }
            else
            {
                $code = $this->_methods[$command];
                
                if (isset($code))
                {
                    eval($code);
                    return;
                }
                $this->error("Unknown Command '$command'");
            }
        }
        catch (Exception $e)
        {
            $this->error("trapped error " .$e->getMessage());
        }  
   }
};
?>