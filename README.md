# dani-pad

it's a different note pad, I call it dani-pad;

it's made with vuejs, php and json for storing data;

you can make a category and add some note to any of them;

Now you can make task and set time you need to done this, add time you spend on it in several time;

## Features in summary
* categories
    * multi background color
    * every category has been contain note and task
    * removable
    * editable the title
    * copiable
    * move with drag and drop and save the position automatic
* notes
    * multi background color
    * removable and editable
    * copiable
* tasks
    * multi background color
    * removable
    * editable the description
    * copiable
    * set time need to done this in **hour** unit
    * add multi time when done part of the task in **hour** unit
    * show sum done time and time need to done
    * Title, Time, Progress, Done columns  is sortable, just click on them

### Easy To Use

1. download the project
2. install dependency
    * on local
        * web server
            1. install [xampp](https://www.apachefriends.org) or [wamp](http://www.wampserver.com) or anything that do the same work
            1. According to the document that you install from top list, put the file in the directory
            1. by default in your browser type this in the address bar **localhost**
        * just php
            1. install [php](https://www.php.net/)
            1. go to the directory project in every where you want to store and use this ``` php -S localhost:8080 ``` in cmd or terminal
            1. in your browser type this in the address bar **localhost:8080**
    * on web
        1. upload the project on any directory on your host or server
        2. in your browser type your domain address in the address bar
3. for the first time you run it just there is a item **Add New Category** click it and make your first category

4. **congratulations you did it**

#### More Info For Using

###### Icon Learning
icon  | description | where
----- | ----------- | -----
![pencil](assets/client/theme/img/icon/readme/pencil.png) | add new note | category
![clock](assets/client/theme/img/icon/readme/clock.png) | add new task | category
![plus](assets/client/theme/img/icon/readme/plus.png) | add new topic | add new task
![quit](assets/client/theme/img/icon/readme/quit.png) | remove topic | add new task
![schedule](assets/client/theme/img/icon/readme/schedule.png) | add new time | task
![eraser](assets/client/theme/img/icon/readme/eraser.png) | edit | every where
![scissors](assets/client/theme/img/icon/readme/scissors.png) | remove | every where
![copy](assets/client/theme/img/icon/readme/copy.png) | copy | every where
![goal](assets/client/theme/img/icon/readme/goal.png) | done status | category ( now not programmed )
![promotion](assets/client/theme/img/icon/readme/promotion.png) | in progress status | category ( now not programmed )

in totally eraser icon for edit something and scissors icon for remove something

inside a category there are color box, pencil icon, time icon
* color box: when you define a category, note or a task you can select a color, when you edit note or task you can change color
    * *notice!*  when you select a color, after that any change or define, it will be use the color in every category
* pencil icon: you can define a note
* time icon: you can make a task in topic name part you can define topic and remove them , they will save

inside a task there is an extra icon that belong to todo icon
* todo icon: add new time that you spend on the task **in hour unit**
* hover on time and done cell, you can see the time in this format **hh:mm**

with drag and drop the categories you can sort them and it will automatic save