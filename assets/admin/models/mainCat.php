<?php
namespace models;
require_once "traits/JsonModel.php";
require_once "notes.php";

use models\notes;

class mainCat{

    use JsonModel;

    private $noteClass;

    public function __construct(){
        $this->setFileAddress("../data/cache/mainCat.json");
        $this->setSuccessMessage("Done");
        $this->noteClass = new notes();
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
            "description"=>$data["description"]
        );

        $this->noteClass->createPart($data["id"]);
        echo $this->putData ($oldContent);
    }

    /**
     * @param $data
     */
    public function remove ($data){

        $oldContent = $this->getData();

        if (count($oldContent) > 1){
            array_splice($oldContent,intval($data["id"]),1);
        }else{
            $oldContent = array();
        }

        $this->noteClass->removeAllParts($data);
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

}