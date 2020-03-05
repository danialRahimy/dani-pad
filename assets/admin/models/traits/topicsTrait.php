<?php


namespace models;
require_once "JsonModel.php";

trait topicsTrait
{

    use JsonModel;

    public function __construct(){
        $this->setFileAddress("../data/cache/topics.json");
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

        $data["values"]["studied"] = floatval($data["values"]["studied"]);

        $oldContent[] = $data["values"];

        echo $this->putData($oldContent);

    }

    public function deactivateTopic ($data){

        $oldContent = $this->getData();

        $oldContent[intval($data["values"]["id"])]["active"] = false;

        echo $this->putData($oldContent);

    }

}