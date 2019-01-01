<?php
header("Content-Type: application/javascript");
include_once "./api/classes/packer.php";

$js = $_GET['js'];

if (stripos($js,".js") === false)
    $js .= ".js";

$jsfn = str_replace("./","_",$js);
$jsfn = str_replace("/","_",$jsfn);

if (!file_exists(__DIR__ . "/production/") )
{
    @mkdir(__DIR__ . "/production/");
}
$packed = "";
if (file_exists(__DIR__ . "/production/" . $jsfn))
{
    $packed = file_get_contents(__DIR__ . "/production/" . $jsfn );
}
else
{
    $path = pathinfo($js);    
    
    $script= file_get_contents($js);
    if ($script !== false)
    {
        $myPacker = new Packer($script, 'Normal', true, false, false);
        $packed = $myPacker->pack();
        $packed .= PHP_EOL . "//# sourceURL=" . $path['basename'];
        file_put_contents(__DIR__ . "/production/" . $jsfn, $packed );
    }
}
echo $packed;
?>