<?php


namespace models;
require_once "JsonModel.php";

trait tasksTrait
{

    use JsonModel;

    public function __construct(){
        $this->setFileAddress("../data/cache/tasks.json");
        $this->setSuccessMessage("Done");
    }

    public function create ($id){

        $oldContent = $this->getData();

        $oldContent[$id] = array();

        $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function add ($data){

        $oldContent = $this->getData();

        $data["values"]["NeedToStudy"] = floatval($data["values"]["NeedToStudy"]);
        $data["values"]["studied"] = array(0);

        $oldContent[$data["id"]][] = $data["values"];

        echo $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function remove ($data){

        $oldContent = $this->getData();

        if (count($oldContent[$data["id"]]) === 1){
            $oldContent[$data["id"]] = array();
        }else{
            array_splice($oldContent[$data["id"]],intval($data["subId"]),1);
        }

        echo $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function removeAll ($data){

        $oldContent = $this->getData();

        unset($oldContent[$data["id"]]);

        $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function edit ($data){

        $oldContent = $this->getData();

        $oldContent[$data["id"]["parent"]][intval($data["id"]["child"])]["color"] = $data["values"]["color"];
        $oldContent[$data["id"]["parent"]][intval($data["id"]["child"])]["description"] = $data["values"]["description"];

        echo $this->putData($oldContent);

    }

    public function addTime($data){

        $oldContent = $this->getData();

        $oldContent[$data["id"]["parent"]][intval($data["id"]["child"])]["studied"][] = floatval($data["values"]["value"]);

        echo $this->putData($oldContent);

    }

}