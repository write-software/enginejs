<?php

function trace($msg)
{
    echo $msg . "<br>";
    ob_flush();
    flush();
}
function recurse_copy($src,$dst) 
{ 
    $dir = opendir($src); 
    @mkdir($dst); 
    while(false !== ( $file = readdir($dir)) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( !is_dir($src . '/' . $file) ) { 
                copy($src . '/' . $file,$dst . '/' . $file); 
            }
            else
                recurse_copy($src . '/' . $file, $dst . '/' . $file); 
        } 
    } 
    closedir($dir); 
} 
function copyfolder($src,$dst) 
{ 
    $dir = opendir($src); 
    @mkdir($dst); 
    while(false !== ( $file = readdir($dir)) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( !is_dir($src . '/' . $file) ) { 
                copy($src . '/' . $file,$dst . '/' . $file); 
            }
        } 
    } 
    closedir($dir); 
} 
function recursiveDelete($str) {
    if (is_file($str)) {
        return @unlink($str);
    }
    elseif (is_dir($str)) {
        $scan = glob(rtrim($str,'/').'/*');
        foreach($scan as $index=>$path) {
            recursiveDelete($path);
        }
        return @rmdir($str);
    }
}
function recurse_package($entries)
{
    global $vendors ;

    foreach ($entries as $key => $entry)
    {
        if (is_array ($entry))
        {
            foreach($entry as $vendor)
            {
                if (($p = stripos($vendor,"vendors")) !== false)
                {
                    $vendor = substr($vendor,$p+8);
                    $p = stripos($vendor,"/");
                    $vendor = substr($vendor,0,$p);
                    if (!in_array($vendor,$vendors))
                        array_push($vendors,$vendor);    
                }
            }
        }
        else if (is_object ($entry) && substr($key,0,1) != "!")
        {
            trace($key);
            recurse_package($entry);
        }
    }    
}

trace("Start...");
$package = file_get_contents("package.json");
$package = json_decode($package);

recursiveDelete(__DIR__ . "/distribution/");
@mkdir("distribution");
trace("cleaning old dist folder");
trace("copying base files");
@mkdir (__DIR__ . "/distribution/app/");
@mkdir (__DIR__ . "/distribution/assets/");
@mkdir (__DIR__ . "/distribution/engine/");
@mkdir (__DIR__ . "/distribution/engine/components");
@mkdir (__DIR__ . "/distribution/engine/themes");
@mkdir (__DIR__ . "/distribution/engine/vendors");
copy(__DIR__ . '/index.html',__DIR__ . '/distribution/index.html'); 
copy(__DIR__ . '/index.js',__DIR__ . '/distribution/index.js'); 
copy(__DIR__ . '/package.json',__DIR__ . '/distribution/package.json'); 
trace("copying app files");
recurse_copy("./app/","./distribution/app/");
recurse_copy("./assets/","./distribution/assets/");
recurse_copy("./engine/components","./distribution/engine/components");
recurse_copy("./engine/themes","./distribution/engine/themes");
trace("copying enginejs files");
copyfolder("./engine","./distribution/engine");
$vendors = array();
trace("reading the vendors from the package");
recurse_package($package->source);
foreach ($vendors as $entry)
{
    trace("..." . $entry);
    recurse_copy("./engine/vendors/$entry","./distribution/engine/vendors/$entry");
}
trace("...End");


?>