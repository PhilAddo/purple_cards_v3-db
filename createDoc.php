<?php
$docName = $_POST['docName'];
$docBody = $_POST['docBody'];

//$docBodyObj = json_decode($docBodyJSON);


if($docBody != null){
 $handle = fopen('cards/'.$docName, 'a');

 fwrite($handle, $docBody);
 
 fclose($handle);
 echo "File created";
 //echo $docName;
}
 else{
     echo "File not created";
 }
?>