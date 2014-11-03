<?php

session_start();
//print_r($_SERVER);
require 'vendor/autoload.php';
//print("Slim");
$app = new \Slim\Slim();

$paramValue["get"] = $app->request->get();
$paramValue ["put"] = $app->request->put();
$paramValue["post"] = $app->request->post();


//$paramValue=$app->request->params();

$app->get('/hello', function ($name) {
    global $paramValue;
    echo "Salut !" . print_r($paramValue, true);
});

$app->get('/hello/:name', function ($name) {
    global $paramValue;
    echo "Hello, $name" . print_r($paramValue, true);
});

$app->put('/hello/:name', function ($name) {
    global $paramValue;

    echo "Hello, $name" . print_r($paramValue, true);
});

$app->post('/hello/:name', function ($name) {
    global $paramValue;
    echo "Hello, $name" . print_r($paramValue, true);
});


$app->get('/treeGrid', function ($name) {
    global $paramValue;
    //echo "treeGRid ici !" . print_r($paramValue, true);
    include './classes/treeGrid.php';
});

$app->get('/FT/:id', function ($id) {
    global $paramValue;
    //echo "get ".$id."<br>";
    
    $url="http://fichetech/edt.php?NFT=".$id."&new&niv=".$_SESSION["niv"];
    $contents="<script>window.open('".$url."');</script>";
    //$contents=  file_get_contents($url);
    
    //print($url);
    print(''.$contents);
});

$app->get('/FT/:id/:mode', function ($id,$mode) {
    global $paramValue;
    //echo "get ".$id."<br>";
    
    $url="http://fichetech/edt.php?NFT=".$id."&new&niv=".$_SESSION["niv"];
    //include './classes/jsonFT.php';
});

$app->put('/FT/:id', function ($id) {
    global $paramValue;
    echo "update ".$id;
});

$app->post('/FT', function () {
    global $paramValue;
    echo "create FT ".date("d-m-Y H:i:s");
});
$app->delete('/FT', function () {
    global $paramValue;
    echo "del FT ";
});




$app->run();
