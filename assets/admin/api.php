<?php

if ($_POST["type"] === "mainCategory"){

    if ($_POST["subType"] === "add"){

        $oldContent = json_decode(file_get_contents("../data/mainCat.json"),JSON_UNESCAPED_UNICODE);
        $oldContent[] = array(
            "id"=>intval($_POST["data"]["id"]),
            "title"=>$_POST["data"]["title"],
            "tips"=>array(),
            "description"=>array(),
        );

        file_put_contents("../data/mainCat.json",json_encode($oldContent,JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT));

        echo json_encode(array("status"=>"success","message"=>"با موفقیت ثبت شد"),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT);

    }

    if ($_POST["subType"] === "remove"){

        $oldContent = json_decode(file_get_contents("../data/mainCat.json"),JSON_UNESCAPED_UNICODE);

        if (count($oldContent) > 1){
            array_splice($oldContent,intval($_POST["data"]["id"]),1);
        }else{
            $oldContent = array();
        }

        file_put_contents("../data/mainCat.json",json_encode($oldContent,JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT));

        echo json_encode(array("status"=>"success","message"=>"با موفقیت حذف شد"),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT);

    }

    if ($_POST["subType"] === "addParts"){

        $oldContent = json_decode(file_get_contents("../data/mainCat.json"),JSON_UNESCAPED_UNICODE);
        $oldContent[intval($_POST["data"]["id"])][$_POST["data"]["value"]][] = $_POST["data"]["description"];

        file_put_contents("../data/mainCat.json",json_encode($oldContent,JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT));

        echo json_encode(array("status"=>"success","message"=>"با موفقیت ثبت شد"),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT);

    }

    if ($_POST["subType"] === "removeParts"){

        $oldContent = json_decode(file_get_contents("../data/mainCat.json"),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT | true);
        $oldContent = json_decode(json_encode($oldContent), true);
        if (count($oldContent[intval($_POST["data"]["id"])][$_POST["data"]["value"]]) === 1){
            $oldContent[intval($_POST["data"]["id"])][$_POST["data"]["value"]] = array();
        }else{
            array_splice($oldContent[intval($_POST["data"]["id"])][$_POST["data"]["value"]],intval($_POST["data"]["subId"]),1);
        }

        file_put_contents("../data/mainCat.json",json_encode($oldContent,JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT | true));

        echo json_encode(array("status"=>"success","message"=>"با موفقیت حذف شد"),JSON_UNESCAPED_UNICODE | JSON_OBJECT_AS_ARRAY | JSON_PRETTY_PRINT);

    }

}
