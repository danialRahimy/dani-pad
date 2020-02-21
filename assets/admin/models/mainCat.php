<?php

namespace models;

class mainCat{

    private $catFileAddress = "../data/mainCat.json";
    private $successMessage = "Done";

    /**
     * @return mixed
     */
    private function getDataMainCat (){

        return json_decode(file_get_contents($this->catFileAddress),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY);

    }

    /**
     * @param $data
     *
     * @return false|string
     */
    private function putDataMainCat ($data){

        file_put_contents($this->catFileAddress,json_encode($data,JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT));

        return json_encode(array("status"=>"success","message"=>$this->successMessage),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT);

    }

    /**
     * @param $data
     */
    public function add ($data){

        $oldContent = $this->getDataMainCat ();
        $oldContent[] = array(
            "id"=>intval($data["id"]),
            "title"=>$data["title"],
            "status"=>$data["status"],
            "color"=>$data["color"],
            "description"=>$data["description"],
            "values"=>array(),
        );

        echo $this->putDataMainCat ($oldContent);
    }

    /**
     * @param $data
     */
    public function remove ($data){

        $oldContent = $this->getDataMainCat();

        if (count($oldContent) > 1){
            array_splice($oldContent,intval($data["id"]),1);
        }else{
            $oldContent = array();
        }

        echo $this->putDataMainCat($oldContent);

    }

    /**
     * @param $data
     */
    public function edit ($data){

        $oldContent = $this->getDataMainCat();

        $oldContent[intval($data["id"])]["title"] = $data["values"];

        echo $this->putDataMainCat($oldContent);

    }

    /**
     * @param $data
     */
    public function addParts ($data){

        $oldContent = $this->getDataMainCat();

        $oldContent[intval($data["id"])][$data["value"]][] = $data["values"];

        echo $this->putDataMainCat($oldContent);

    }

    /**
     * @param $data
     */
    public function removeParts ($data){

        $oldContent = $this->getDataMainCat();
        $oldContent = json_decode(json_encode($oldContent), true);

        if (count($oldContent[intval($data["id"])][$data["value"]]) === 1){
            $oldContent[intval($data["id"])][$data["value"]] = array();
        }else{
            array_splice($oldContent[intval($data["id"])][$data["value"]],intval($data["subId"]),1);
        }

        echo $this->putDataMainCat($oldContent);

    }

    /**
     * @param $data
     */
    public function editParts ($data){

        $oldContent = $this->getDataMainCat();

        $oldContent[intval($data["id"]["parent"])][$data["value"]][intval($data["id"]["child"])]["color"] = $data["values"]["color"];
        $oldContent[intval($data["id"]["parent"])][$data["value"]][intval($data["id"]["child"])]["value"] = $data["values"]["value"];

        echo $this->putDataMainCat($oldContent);

    }

}