<?php

require_once "models/mainCat.php";

use models\mainCat;

$mainCat = new mainCat();

if ($_POST["type"] === "mainCategory"){

    if ($_POST["subType"] === "add"){
        $mainCat->add($_POST["data"]);
    }

    if ($_POST["subType"] === "remove"){
        $mainCat->remove($_POST["data"]);
    }

    if ($_POST["subType"] === "edit"){
        $mainCat->edit($_POST["data"]);
    }

    if ($_POST["subType"] === "addParts"){
        $mainCat->addParts($_POST["data"]);
    }

    if ($_POST["subType"] === "removeParts"){
        $mainCat->removeParts($_POST["data"]);
    }

    if ($_POST["subType"] === "editParts"){
        $mainCat->editParts($_POST["data"]);
    }

}
