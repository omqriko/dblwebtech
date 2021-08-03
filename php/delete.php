<?php
// set directory
$location = "../datasets/custom.json";

// give permissions
chmod($location, 0644);

// delete file stored at $location
unlink($location);

// clear the cache so it can't be used anymore during this session either
clearstatcache();

// reload the upload page
header("Location: ../html/upload.html");
?>