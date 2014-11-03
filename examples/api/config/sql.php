<?php

$sql["fullFT"]="SELECT * FROM FICENT E "
        . " INNER JOIN FICELT L ON E.INDX=L.NFIC  "
        . " INNER JOIN FICPROC P ON L.INDX=P.NELT "
        . " INNER JOIN FICMACH M ON P.INDX=M.NPROC"
        . " INNER JOIN FICGRP G ON M.INDX=G.MACHID"
        . " INENR JOIN FICPATE T ON T.INDX=G.PATEINDX"
        . " INNER JOIN FICENC C ON T.INDX=C.PATEINDX";


class sqlInfo{
    public $sql;
    public $name;
    public $child=null;
    
}

$ent=new sqlInfo();
$ent->sql="SELECT * FROM FICENT WHERE INDX={INDX}";
$ent->name="entete";


$elt=new sqlInfo();
$elt->sql="SELECT * FROM FICELT WHERE NELT={L_INDX}";
$elt->name="elements";

$proc=new sqlInfo();
$proc->sql="SELECT * FROM FICPROC WHERE L.NFIC={E_INDX}";
$proc->name="elements";


$elt=new sqlInfo();
$elt->sql="SELECT * FROM FICENT WHERE INDX={INDX}";
$elt->name="entete";


/*

$sql["root"]["SQL"]=
$sql["ROOT"]["NAME"]="Entete";
$sql["ROOT"]["CHILD"]
$sql["ENT2"]="SELECT * FROM FICENT WHERE NFT={NFT}";
$sql["ELT"]="SELECT * FROM FICENT WHERE INDX={INDX}";

  */      

