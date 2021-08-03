<?php

// this is where the file will be saved
$location = "../datasets/custom.json";
// allow uploads
$uploadOk = 1;


// we will only have csv or json files since we don't allow other file types
$fileType = strtolower(pathinfo(basename($_FILES["uploadForm"]["name"]),PATHINFO_EXTENSION));

if($fileType == "json") {
  // upload the file
  move_uploaded_file($_FILES["uploadForm"]["tmp_name"], $location);
    // reload the upload page
    header("Location: ../html/upload.html");
} elseif($fileType == "csv"){
    // first upload the file without converting it, we will modify it later
    move_uploaded_file($_FILES["uploadForm"]["tmp_name"], $location);
    
    // give permission for the fucntion to access the file saved at $location
    chmod($location, 0644);
    
    // check that it's possible to open the location for reading and open it if possible
    $file_path = fopen($location, 'r');
    
    //read csv headers by splitting the first row on columns
    $column_names = fgetcsv($file_path,"1024",",");
    
    // create an array that will hold the objects
    $json = array();
    
    // while there are rows
    while ($row = fgetcsv($file_path,"1024",",")) {
    $json[] = array_combine($column_names, $row);
    }
    
    // release file handle
    fclose($file_path);

    // check that it's possible to open the location for writing and open it if possible
    // we do this separately to not add to the dataset but to replace it
    $file_path = fopen($location, 'w');
    
    // overwrite the filedata with the data encoded as a json file
    fwrite($file_path, json_encode($json));
    
    // release file handle
    fclose($file_path);

    // clear the cache to avoid it not being selected due to that
    clearstatcache();

    // reload the upload page
    header("Location: ../html/upload.html");
    
} else { // this should be impossible since the html form only allows csv or json files
    // empty files are also not possible due to the changelistener in upload.js
    echo "Please select a .csv or .json file.";
}
?>