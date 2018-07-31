<?php

error_reporting ( E_ALL ^ E_WARNING ^ E_NOTICE );

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
                                   
if( !isset($_SESSION['last_access']) || (time() - $_SESSION['last_access']) > 60 )
	$_SESSION['last_access'] = time();

function _getParam($sParam)
{
    if (isset($_POST[$sParam]))
        return  $_POST[$sParam];
    else if (isset($_GET[$sParam]))
        return  $_GET[$sParam];
    else
        return "";
};

$path = realpath(dirname(__FILE__));
include_once "./classes/iniClass.php";

set_time_limit(600);
ini_set("session.cookie_lifetime","3600");
// Uncomment the correct timezone
date_default_timezone_set('Europe/London');
//date_default_timezone_set('Europe/Paris');
//date_default_timezone_set('Europe/Athens');
//date_default_timezone_set('America/Los_Angeles');
//date_default_timezone_set('America/New_York');
//date_default_timezone_set('Australia/Darwin');
//date_default_timezone_set('Australia/Perth');
//date_default_timezone_set('Australia/Sydney');
  
ini_set('memory_limit', '640M');

$path = realpath(dirname(__FILE__));
$pwd = "Solutions!";
$ini = new ini();

$ini->read($path . "/setup.ini");
$prodname = $ini->get('CONFIG', 'name', "DW WiFi");
$pwd = $ini->get('CONFIG', 'pwd', $pwd);
$server = $ini->get('CONFIG', 'server', "");
define("_BASEDB", "dw");
define("_SERVERNAME", $prodname);
define("_ACCOUNT", "dw");
define("_PINCODE", "20180000");
define("_DBCODE", "20180000");
define("_DBTYPE", "mysql");
define("_DBHOST", "127.0.0.1");
define("_DBPORT", ":3306");
define("_DBUSER", "root");
define("_DBPASS", $pwd);
define("_DBNAME", _BASEDB . "_" . _DBCODE);
define("_SAAS","saas");
?>