<?php

use helpers\required;

require_once "assets/admin/helpers/required.php";
//spl_autoload_register(function ($class_name) {
//    include 'assets/admin/' . $class_name . '.php';
//});

$require = new required();

?>

<!DOCTYPE html>
<html lang="fa">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <?= $require->indexFiles() ?>
    <?= $require->requiredFiles() ?>
</head>
<body data-direction="ltr">
<section id="gitGuide">

</section>
</body>
</html>