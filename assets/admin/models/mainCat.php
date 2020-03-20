<?php
namespace models;
require_once "traits/JsonModel.php";
require_once "notes.php";
require_once "tasks.php";
require_once "topics.php";

use models\notes;
use models\topics;
use models\tasks;

class mainCat{

    use JsonModel;

    private $noteClass;
    private $tasksClass;

    public function __construct(){
        $this->setFileAddress("../data/cache/mainCat.json");
        $this->setSuccessMessage("Done");
        $this->noteClass = new notes();
        $this->tasksClass = new tasks();
    }

    /**
     * @param $data
     */
    public function add ($data){

        $oldContent = $this->getData ();

        $oldContent[] = array(
            "id"=>intval($data["id"]),
            "title"=>$data["title"],
            "status"=>$data["status"],
            "color"=>$data["color"],
            "description"=>$data["description"],
            "order"=>intval($data["order"])
        );

        $this->noteClass->create($data["id"]);
        $this->tasksClass->create($data["id"]);

        echo $this->putData ($oldContent);
    }

    /**
     * @param $data
     */
    public function remove ($data){

        $oldContent = $this->getData();

        if (count($oldContent) > 1){
            array_splice($oldContent,intval($data["index"]),1);
        }else{
            $oldContent = array();
        }

//        $this->noteClass->removeAll($data);
        echo $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function edit ($data){

        $oldContent = $this->getData();

        $oldContent[intval($data["id"])]["title"] = $data["values"];

        echo $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function updateOrder ($data){

        $oldContent = $this->getData();

        for ($i = 0 ; $i < count($oldContent) ; $i++){
            $oldContent[$i]["order"] =  intval($data["values"][$i]);
        }

        echo $this->putData($oldContent);

    }

    private function returnBool ($data){

        if ($data == "true")
            return true;
        elseif ($data == "false")
            return false;

    }

    /**
     * @param $data
     */
    public function copy ($data){

        $oldContent = $this->getData();

        $index = count($oldContent);
        $oldContent[] = $oldContent[intval($data["targetId"])];
        $theCat = $oldContent[$index];
        $theId = $theCat["id"];

        $notes = $this->noteClass->getData();
        $notes[$data["newId"]] = $notes[$theId];
        $this->noteClass->putData($notes);

        $tasks = $this->tasksClass->getData();
        $tasks[$data["newId"]] = $tasks[$theId];
        $this->tasksClass->putData($tasks);

        $oldContent[$index]["id"] = intval($data["newId"]);
        $oldContent[$index]["order"] = intval($data["newOrder"]);
        $oldContent[$index]["title"] = $data["title"];

        echo $this->putData($oldContent);

    }

}