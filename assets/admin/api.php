<?php

require_once "models/mainCat.php";
require_once "models/notes.php";
require_once "models/tasks.php";
require_once "models/topics.php";

use models\mainCat;
use models\notes;
use models\topics;
use models\tasks;

$mainCatClass = new mainCat();
$notesClass = new notes();
$topicsClass = new topics();
$tasksClass = new tasks();

if ($_POST["type"] === "mainCategory"){

    if ($_POST["which"] === "mainCat"){

        if ($_POST["subType"] === "add"){
            $mainCatClass->add($_POST["data"]);
        }

        if ($_POST["subType"] === "remove"){
            $mainCatClass->remove($_POST["data"]);
        }

        if ($_POST["subType"] === "edit"){
            $mainCatClass->edit($_POST["data"]);
        }

        if ($_POST["subType"] === "updateOrder"){
            $mainCatClass->updateOrder($_POST["data"]);
        }

        if ($_POST["subType"] === "copy"){
            $mainCatClass->copy($_POST["data"]);
        }

    }

    if ($_POST["which"] === "note"){

        if ($_POST["subType"] === "add"){
            $notesClass->add($_POST["data"]);
        }

        if ($_POST["subType"] === "remove"){
            $notesClass->remove($_POST["data"]);
        }

        if ($_POST["subType"] === "edit"){
            $notesClass->edit($_POST["data"]);
        }

        if ($_POST["subType"] === "copy"){
            $notesClass->copy($_POST["data"]);
        }

    }

    if ($_POST["which"] === "task"){

        if ($_POST["subType"] === "add"){
            $tasksClass->add($_POST["data"]);
        }

        if ($_POST["subType"] === "remove"){
            $tasksClass->remove($_POST["data"]);
        }

        if ($_POST["subType"] === "edit"){
            $tasksClass->edit($_POST["data"]);
        }

        if ($_POST["subType"] === "addTime"){
            $tasksClass->addTime($_POST["data"]);
        }

        if ($_POST["subType"] === "copy"){
            $tasksClass->copy($_POST["data"]);
        }

    }

    if ($_POST["which"] === "topic"){

        if ($_POST["subType"] === "add"){
            $topicsClass->add($_POST["data"]);
        }

        if ($_POST["subType"] === "deactivateTopic"){
            $topicsClass->deactivateTopic($_POST["data"]);
        }
    }

    if ($_POST["subType"] === "get"){

        $data = array(
            "mainCat" => $mainCatClass->getData(), // Get Categories
            "notes"   => $notesClass->getData(), // Get Notes
            "tasks"   => $tasksClass->getData(), // Get Tasks
            "topics"   => $topicsClass->getData(), // Get Topics
        );

        for ($i = 0 ; $i < count($data["mainCat"]) ; $i++ ){
            $id = strval($data["mainCat"][$i]["id"]);

            // get relative note
            if (array_key_exists($id,$data["notes"]))
                $data["mainCat"][$i]["note"] = $data["notes"][$id];
            else
                $data["mainCat"][$i]["note"] = array();

            // get relative tasks
            if (array_key_exists($id,$data["tasks"]) and is_array($data["tasks"][$id]) and count($data["tasks"][$id]) > 0) {

                $data["mainCat"][$i]["task"] = $data["tasks"][$id];

                // get relative topic
                for ($j = 0; $j < count($data["tasks"][$id]); $j++) {

                    if (is_array($data["tasks"][$id][$j]) and count($data["tasks"][$id][$j]) > 0) {

                        $topicId = $data["tasks"][$id][$j]["topic"];

                        if (array_key_exists($topicId, $data["topics"])){
                            $data["mainCat"][$i]["task"][$j]["topicName"] = $data["topics"][$topicId]["name"];
                            $data["mainCat"][$i]["task"][$j]["active"] = boolval($data["topics"][$topicId]["active"]);
                        }


                    }
                }

            }else {
                $data["mainCat"][$i]["task"] = array();
            }
        }

        unset($data["notes"]);
        unset($data["tasks"]);

        echo json_encode($data,JSON_OBJECT_AS_ARRAY | JSON_UNESCAPED_UNICODE);

    }

}
