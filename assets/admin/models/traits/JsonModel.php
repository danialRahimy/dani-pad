<?php


namespace models;


trait JsonModel
{

    private $fileAddress = "";
    private $successMessage = "";

    private function setFileAddress ($value){
        $this->fileAddress = $value;
    }

    private function setSuccessMessage ($value){
        $this->successMessage = $value;
    }

    /**
     * @return mixed
     */
    public function getData (){

        return json_decode(file_get_contents($this->fileAddress),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY);

    }

    /**
     * @param $data
     *
     * @return false|string
     */
    public function putData ($data){

        file_put_contents($this->fileAddress,json_encode($data,JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT));

        return json_encode(array("status"=>"success","message"=>$this->successMessage),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT);

    }
}