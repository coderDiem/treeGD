<?php

session_start();

//print_r($_SESSION);
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//print_r($_REQUEST);

require_once '../config/DB.mysql.php';
require_once '../classes/Db.func.php';
require_once '../classes/some.tools.php';

$sql = "SELECT INDX, NFT, TPROD, LIB, LPROD, NMCLI FROM ficent WHERE ST<> 1  {whereCl}";

$groupKeys = array("NMCLI", "LPROD", "LIB");
$lstTPROD = array("Etui", "Coffret", "Carte Ech");
$parms["whereCl"] = "";

foreach ($_GET["s"] as $fld => $val) {
    if ($val != "") {
        $parms["whereCl"] .= " AND " . $fld . " like '%" . $val . "%' ";
    }
}

$sql = phpTools::parseOpts($sql, $parms);
$cptG = 0;
if (count($groupKeys) > 0) {


    $sql .= " ORDER BY ";
    foreach ($groupKeys as $gKey) {
        $sep = ",";
        if ($cptG == 0) {
            $sep = "";
        }

        $sql.=$sep . $gKey . " ";
        // print($cptG . "<br>");
        $cptG++;
    }
}
//$sql.=" LIMIT 800, 50 ";
//$rows = runSQL::lineSql($sql, $dbPDO["MYSQL"], 'all');
$start='all';
$lg=0;

if(isset($_GET["rowsPerPage"]))
{
    $lg=$_GET["rowsPerPage"];
}

if(isset($_GET["page"]))
{
    $page=$_GET["page"];
    if($lg>0)
    {
        $start=($page-1)*$lg;
    }
}

//print("longueur : ".$lg." -> start : ".$start." \n");

$sqlcount="SELECT COUNT(*) as NB FROM (".$sql.") AS T";

$nbRec= runSQL::lineSql($sqlcount, $dbPDO["MYSQL"], 1);

$rows = runSQL::limitSql($sql, $dbPDO["MYSQL"], $start,$lg);
//print($sql);
if ($_GET["debug"] == 'true') {
    $rsp["sql"] = $sql;
}


//print_r($rows);
foreach ($rows as $nRow => $row) {
    foreach ($row as $fld => $val) {
        $row[$fld] = utf8_decode(urldecode($val));
        if ($_GET["debug"] == 'true') {
            print($row[$fld] . " <=" . $val . "\n");
        }
    }

    $row["typProd"] = $lstTPROD[$row["TPROD"]];



    $row["actions"] = "";

//ajout des boutons
    $row["actions"].= "<TD id=\"edit" . $cpt . "\" onclick=\"ficTech.edit('" . $row["NFT"] . "')\" onmouseover=\"$(this).addClass('ui-state-hover');\" onmouseout=\"$(this).removeClass('ui-state-hover');\" class=\"ui-state-default ui-corner-all hand\" width=\"20\"><IMG SRC=\"./img/edit.png\" title=\"Visualiser la fiche\" ></TD>\n";
    $row["actions"] .= "<TD id=\"impr2" . $cpt . "\" onclick=\"ficTech.imp('" . $row["NFT"] . "','imp1')\" onmouseover=\"$(this).addClass('ui-state-hover');\" onmouseout=\"$(this).removeClass('ui-state-hover');\" class=\"ui-state-default ui-corner-all hand\" width=\"20\"><IMG SRC=\"./img/imp2.png\" title=\"imprimer la fiche PAO\" ></TD>\n";
    $row["actions"] .= "<TD id=\"impr1" . $cpt . "\" onclick=\"ficTech.imp('" . $row["NFT"] . "','imp2')\" onmouseover=\"$(this).addClass('ui-state-hover');\" onmouseout=\"$(this).removeClass('ui-state-hover');\" class=\"ui-state-default ui-corner-all hand\" width=\"20\"><IMG SRC=\"./img/imp1.png\" title=\"imprimer la fiche PROD\" ></TD>\n";
    /*
      $affAct ="<a href=\"#\" id=\"edt_link\"  class=\"ui-state-default ui-corner-all\" title=\"Visualiser la fiche\"> <span class=\"ui-icon ui-icon-pencil\"></span>&nbsp;</a></td>\n";
      $affAct.="<td><a href=\"#\" id=\"imp2_link\" class=\"ui-state-default ui-corner-all\" title=\"imprimer la fiche PAO\"><span class=\"ui-icon ui-icon-print\"></span>&nbsp;</a></td>";
      $affAct.="<td><a href=\"#\" id=\"imp1_link\" class=\"ui-state-default ui-corner-all\" title=\"imprimer la fiche PROD\"><span class=\"ui-icon ui-icon-script\"></span>&nbsp;</a></td>\n<td>"; */
    if ($_GET["niv"] > 11) {
        $row["actions"] .= "<TD id=\"supp" . $i . "\" onclick=\"ficTech.del('" . $row["NFT"] . "')\" onmouseover=\"$(this).addClass('ui-state-hover');\" onmouseout=\"$(this).removeClass('ui-state-hover');\" class=\"ui-state-default ui-corner-all hand\" width=\"20\"><IMG SRC=\"./img/del.png\" title=\"supprimer la fiche\" ></TD>\n";
    }
//$affAct="toolbar";
    $clss = "ui-state-default ui-corner-all ui-widget-content";
    $row["infos"] = "<TD id=\"info" . $cpt . "\" onclick=\"fficTech.viewArt('" . $row["NFT"] . "')\"  class=\"ui-state-default ui-corner-all hand\" width=\"20\"><IMG SRC=\"./img/infos.png\" title=\"Infos Articles\" ></TD>\n";


    $tpl = "<table><tr>\n";
    $tpl.="<td>&nbsp;</td><td>{actions}<td>{NFT}</td><td>{typProd}</td><td>&nbsp;</td><td>{infos}</td>\n";
    $tpl.="</tr></table>\n";
    /*
      $contentRow=implode("</td><td>",$row);
      $contentRow="<table><tr><td>".$contentRow."</td></tr></table>";
     */

    $contentRow = phpTools::parseOpts($tpl, $row);
    $linePhp = "\$rsp[\"contents\"]";
    foreach ($groupKeys as $gK) {
        $linePhp.="[\$row[\"" . $gK . "\"]]";
    }
    //$linePhp.="=\$row;";
    $linePhp.="[".$nRow."]=\$contentRow;"; //['contents']
//echo $linePhp."<br/>";
    eval($linePhp);
}
//$rsp["totalRows"]=count($rows);
$rsp["totalRows"]=$nbRec["NB"];
//$rsp["contents"]["nb lignes"]="<span style='font-size:70%;'>".count($rows)." fiches trouvées</span>";
$rsp["contents"]["nb lignes"]="<span style='font-size:70%;'>".$nbRec["NB"]." fiches trouvées</span>";



$rsp = phpTools::recursiveUTF8encode($rsp);
//print("<pre>".print_r($rsp,true)."</pre>");
$rspJson = json_encode($rsp, JSON_PRETTY_PRINT);
$rspERR = null;
switch (json_last_error()) {
    case JSON_ERROR_NONE:
        // echo ' - Aucune erreur';
        break;
    case JSON_ERROR_DEPTH:
        $rspERR["erreur"]["contents"] = ' - Profondeur maximale atteinte ';
        break;
    case JSON_ERROR_STATE_MISMATCH:
        $rspERR["erreur"]["contents"] = ' - Inadéquation des modes ou underflow ';
        break;
    case JSON_ERROR_CTRL_CHAR:
        $rspERR["erreur"]["contents"] = ' - Erreur lors du contrôle des caractères ';
        break;
    case JSON_ERROR_SYNTAX:
        $rspERR["erreur"]["contents"] = ' - Erreur de syntaxe ; JSON malformé ';
        break;
    case JSON_ERROR_UTF8:
        $rspERR["erreur"]["contents"] = ' - Caractères UTF-8 malformés, probablement une erreur d\'encodage ';
        break;
    default:
        $rspERR["erreur"]["contents"] = ' - Erreur inconnue ';

        break;
}
if (isset($rspERR)) {

    $rspERR["sql"]["contents"] = $rsp["sql"];

    $rspJson = json_encode($rspERR, JSON_PRETTY_PRINT);
}
print($rspJson);



//AND UPPER(TRIM(LIB)) like 'ESSAIS%LEGEND%MONTBLANC%100%ML'  AND UPPER(TRIM(LPROD)) like 'ESSAI%2400'  AND UPPER(TRIM(NMCLI)) like '00000334%GROUPE%INTERPARFUMS'  AND UPPER(TRIM(NFT)) like '%I1400%' 

