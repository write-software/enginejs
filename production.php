<?php
header("Content-Type: application/javascript");
include_once "./api/classes/packer.php";

$js = $_GET['js'];

if (stripos($js,".js") === false)
    $js .= ".js";

$path = pathinfo($js);    

$script= file_get_contents($js);
$myPacker = new Packer($script, 'Normal', true, false, false);
$packed = $myPacker->pack();
$packed .= PHP_EOL . "//# sourceURL=" . $path['basename'];
echo $packed;
?>