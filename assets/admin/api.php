<?php

require_once "models/mainCat.php";
require_once "models/notes.php";

use models\mainCat;
use models\notes;

$mainCatClass = new mainCat();
$notesClass = new notes();

if ($_POST["type"] === "mainCategory"){

    if ($_POST["subType"] === "add"){
        $mainCatClass->add($_POST["data"]);
    }

    if ($_POST["subType"] === "remove"){
        $mainCatClass->remove($_POST["data"]);
    }

    if ($_POST["subType"] === "edit"){
        $mainCatClass->edit($_POST["data"]);
    }

    if ($_POST["subType"] === "addParts"){
        $notesClass->addParts($_POST["data"]);
    }

    if ($_POST["subType"] === "removeParts"){
        $notesClass->removeParts($_POST["data"]);
    }

    if ($_POST["subType"] === "editParts"){
        $notesClass->editParts($_POST["data"]);
    }

    if ($_POST["subType"] === "get"){

        $data = array(
            "mainCat" => $mainCatClass->getData(),
            "notes"   => $notesClass->getData(),
        );

        for ($i = 0 ; $i < count($data["mainCat"]) ; $i++ ){
            $id = $data["mainCat"][$i]["id"];
            $data["mainCat"][$i]["values"] = $data["notes"][$id];
        }

        echo json_encode($data["mainCat"],JSON_OBJECT_AS_ARRAY | JSON_UNESCAPED_UNICODE);

    }

}
