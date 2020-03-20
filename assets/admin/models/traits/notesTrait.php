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
        $oldContent[$data["id"]["parent"]][$data["id"]["child"]]["value"] = $data["values"]["value"];

        echo $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function copy ($data){

        $oldContent = $this->getData();

        $oldContent[$data["id"]][] = $oldContent[$data["id"]][intval($data["subId"])];

        echo $this->putData($oldContent);

    }

}