<?php


namespace models;
require_once "JsonModel.php";

trait notesTrait
{

    use JsonModel;

    public function __construct(){
        $this->setFileAddress("../data/cache/notes.json");
        $this->setSuccessMessage("Done");
    }

    public function createPart ($id){

        $oldContent = $this->getData();

        $oldContent[$id] = array();

        $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function addParts ($data){

        $oldContent = $this->getData();

        $oldContent[$data["id"]][] = $data["values"];

        echo $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function removeParts ($data){

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
    public function removeAllParts ($data){

        $oldContent = $this->getData();

        unset($oldContent[$data["id"]]);

        $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function editParts ($data){

        $oldContent = $this->getData();

        $oldContent[$data["id"]["parent"]][intval($data["id"]["child"])]["color"] = $data["values"]["color"];
        $oldContent[$data["id"]["parent"]][$data["id"]["child"]]["value"] = $data["values"]["value"];

        echo $this->putData($oldContent);

    }

}