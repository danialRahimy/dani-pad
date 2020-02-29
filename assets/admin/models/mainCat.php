<?php
namespace models;
require_once "JsonModel.php";

class mainCat{

    use JsonModel;

    public function __construct(){
        $this->setFileAddress("../data/mainCat.json");
        $this->setSuccessMessage("Done");
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
            "values"=>array(),
        );

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
    public function addParts ($data){

        $oldContent = $this->getData();

        $oldContent[intval($data["id"])][$data["value"]][] = $data["values"];

        echo $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function removeParts ($data){

        $oldContent = $this->getData();
        $oldContent = json_decode(json_encode($oldContent), true);

        if (count($oldContent[intval($data["id"])][$data["value"]]) === 1){
            $oldContent[intval($data["id"])][$data["value"]] = array();
        }else{
            array_splice($oldContent[intval($data["id"])][$data["value"]],intval($data["subId"]),1);
        }

        echo $this->putData($oldContent);

    }

    /**
     * @param $data
     */
    public function editParts ($data){

        $oldContent = $this->getData();

        $oldContent[intval($data["id"]["parent"])][$data["value"]][intval($data["id"]["child"])]["color"] = $data["values"]["color"];
        $oldContent[intval($data["id"]["parent"])][$data["value"]][intval($data["id"]["child"])]["value"] = $data["values"]["value"];

        echo $this->putData($oldContent);

    }

}