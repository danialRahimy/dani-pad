<?php

use helpers\required;

spl_autoload_register(function ($class_name) {
    include 'assets/admin/' . $class_name . '.php';
});

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
<body>
<section id="gitGuide">

</section>
</body>
</html>