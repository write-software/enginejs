<?php 

require_once 'FileBundler.php'; 

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>JavaScript (and CSS) Bundler.  Example page.</title>
</head>

<body>
	<h1>Bundler</h1>
	<?php
		// create bundler for JavaScript files
		$jsBundler = new FileBundler(array(
			"type"=>"js",
			"debugMode"=>true,
			"approot"=>"/www",
			"sourceDir"=>"../app/js",
			"bundleDir"=>"/production"
		)); 

		// add single file to bundle
		$jsBundler->addFile("../apps/scripts/models.js");

		// add multiple files to bundle
		$jsFiles = array("../apps/scripts/dialogs.js", "../apps/controllers/components.js");
		$jsBundler->addFiles($jsFiles);

		// create new (or reuse if existing) bundle
		$jsBundler->writeBundle();
	?>
	
</body>
</html>

