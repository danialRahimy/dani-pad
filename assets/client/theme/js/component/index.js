function indexComponent (){

    Vue.component("add-main-category",{
        template: `
            <div>
                <collapse :dragAble="false" :id="'add-main-category-parent'" :status="'s'" :titleBtn="'Add New Category'" :color="'primary'">
                    <div>
                        <color-box :clickOn="activeColorClicked"></color-box>
                        <input type="text" placeholder="Title" class="form-control mb-2">
                        <textarea placeholder="Description" class="form-control"></textarea>
                        <a class="btn btn-block btn-success mt-2" @click="addNewMainCategory($event)">Submit</a>
                    </div>
                </collapse>
            </div>
        `,

        data: function (){
            return {
                dani: window.dani,
                VueHelpers : VueHelpers,
                config: config, // config general
                dataNeedToSend: {
                    "color" : "secondary"
                }
            }
        },

        methods: {
            addNewMainCategory: function (event) {
                let inputValue = document.querySelector("#add-main-category-parent input").value;
                let textareaValue = document.querySelector("#add-main-category-parent textarea").value;
                const length = dataFromCache.mainCat.length;

                function getID (){
                    let length2 = length;
                    length2 -= 1;
                    if (length > 0){
                        let id = dataFromCache.mainCat[length2].id;
                        id += 1;
                        return id;
                    }else {
                        return 1;
                    }
                }

                let theLength = length;
                theLength += 1;
                let data = {
                    "id":  getID (),
                    "title": inputValue,
                    "status": "inProgress",
                    "color": this.dataNeedToSend.color,
                    "description": textareaValue,
                    "note": [],
                    "task":[],
                    "order": theLength,
                };

                $.ajax({
                    method: "POST",
                    url: this.config.addresses.api,
                    data: {
                        type: "mainCategory",
                        subType: "add",
                        which: "mainCat",
                        data: data
                    }
                })
                    .done(function( msg ) {
                        msg = JSON.parse(msg);
                        if (msg.status === "success"){
                            dataFromCache.mainCat.push(data);
                            Swal.fire({
                                icon: 'success',
                                text: msg.message,
                            })
                        }else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: "Oops...",
                            })
                        }
                    });
            },
            activeColorClicked: function (event) {
                this.VueHelpers.activeColorClicked(event,this);
            },
        }

    });
    Vue.component("add-new-task",{
        props: {
            catId: {
                type: Number,
                required: true
            },
            colorActive: {
                type: String,
                required: true
            },
            index: {
                type: Number,
                required: true
            },
        },
        template:
        `
        <section class="add-new-task">
            <form :name="'add-new-task-' + catId">
                <div class="row">
                <div class="col-lg-6">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="topics-option">Topics Name</label>
                        </div>
                        <select class="custom-select topics-option">
                            <option v-for="(value,index) in dataFromCache.topics" v-if="value.active" :value="index">{{value.name}}</option>
                        </select>
                        <img style="height: 38px;width: 38px;cursor: pointer" @click="addNewTopic($event)" src="/assets/client/theme/img/icon/plus.png" alt="Add New Topic">
                        <img style="height: 38px;width: 38px;cursor: pointer" @click="deactivateTopic($event,catId)" src="/assets/client/theme/img/icon/quit.png" alt="Deactivate Topic">
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Time You Need</span>
                        </div>
                        <input type="number" min="0.016" step="0.001" value="0.016" class="form-control time-you-need" style="text-align: center">
                        <div class="input-group-append">
                            <span class="input-group-text">hour</span>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Description</span>
                        </div>
                        <textarea class="form-control description" placeholder="Type The Description"></textarea>
                    </div>
                </div>
                </div>
                <div class="btn btn-block btn-success" @click="addNewTask($event,index,catId,colorActive)">submit</div>
            </form>
        </section>
        `,
        data: function () {
            return {
                dataFromCache : dataFromCache, // all data got from jsons
                dani: window.dani, // it's a library form myself
                VueHelpers: VueHelpers, // vue heplers
                config: config, // config general
                dataNeedToSend: {
                    "color" : "secondary"
                }, // data need to send to the server
            }
        },
        methods: {
            addNewTask: function (event,index,id,colorActive) {
                let thisV = this;

                const form = document.querySelector("form[name=add-new-task-" + id + "]");
                let topicID = form.querySelector(".topics-option").options[form.querySelector(".topics-option").selectedIndex].value;
                let timeYouNeed = parseFloat(form.querySelector(".time-you-need").value);
                let description = form.querySelector(".description").value;

                /*** get data and send to server ***/
                // get text of value of user
                let data = {
                        "id": id, // index of category on mainCat
                        "values": {
                            "topic": topicID, // get color
                            "description": description, // get color
                            "NeedToStudy": timeYouNeed, // get color
                            "studied":[0],
                            "color": colorActive, // get color
                        }
                    };
                // send data to server
                $.ajax({
                    method: "POST",
                    url: this.config.addresses.api,
                    data: {
                        type: "mainCategory",
                        subType: "add",
                        which: "task",
                        data: data
                    }
                })
                    .done(function( msg ) {
                        msg = JSON.parse(msg);
                        // if success data push to the array in mainCat JUST FOR SHOW ON THE PAGE
                        if (msg.status === "success"){
                            data.values["topicName"] = thisV.dataFromCache.topics[parseInt(topicID)].name;
                            data.values["active"] = true;
                            dataFromCache.mainCat[index]["task"].push(data.values);
                            Swal.fire({
                                icon: 'success',
                                text: msg.message,
                            })
                        }
                        // if get some error of server
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: "Oops...",
                            })
                        }
                    });
            },
            addNewTopic: function (event) {
                Swal.fire({
                    title: 'Type The Name',
                    // inputValue: message,
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off',
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    showLoaderOnConfirm: true,
                }).then((result) => {
                    if (result.value) {
                        // create data need to send
                        let data = {
                            "values": {
                                "name": result.value, // time of value wrote
                                "studied": 0,
                                "active": true,
                            }
                        };

                        // send data to server
                        $.ajax({
                            method: "POST",
                            url: this.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "add",
                                which: "topic",
                                data: data
                            }
                        })
                        // after receive respond of server
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    // if success push data that save to the mainCat JUST FOR SHOW AND RENDER IN PAGE
                                    dataFromCache.topics.push(data.values);
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    // if got some error from server
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });
            },
            deactivateTopic: function (event,id) {
                let thisV = this;

                const form = document.querySelector("form[name=add-new-task-" + id + "]");
                let topicID = form.querySelector(".topics-option").options[form.querySelector(".topics-option").selectedIndex].value;

                let data = {
                    "values": {
                        "id": topicID
                    }
                };

                Swal.fire({
                    title: 'Are You Sure?',
                    text: "It's Can't Be Reverse, Relative Tasks Will Be Remove!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            method: "POST",
                            url: this.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "deactivateTopic",
                                which: "topic",
                                data: data
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.topics[topicID]["active"] = false;
                                    for (let i = 0 ; i < thisV.dataFromCache.mainCat.length ; i++){
                                        let mainCat = thisV.dataFromCache.mainCat[i];
                                        for (let j = 0 ; j < mainCat.task.length ; j++){
                                            let task = mainCat.task[j];
                                            if (task.topic == topicID){
                                                task.active = false;
                                            }
                                        }
                                    }
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });



            }
        }
    });
    Vue.component("main-category",{
        template :
            `
            <div style="position: relative">
                <collapse v-for="(data,index) in dataFromCache.mainCat" :order="data.order" :status="data.status" :mainCatId="index" :key="data.id" :id="dani.randomCharacter(20,'string')" :titleBtn="data.title" :color="data.color">
                    <color-box :clickOn="activeColorClicked"></color-box>
                    <div class="mb-2 text-right">
                        <a class="icons" :data-related-task="index" @click="addNew()" title="Add task"><img src="/assets/client/theme/img/icon/clock.png" alt="Add task" class="add-task"></a>
                        <a class="icons" :data-related-note="index" @click="addAction($event,'note')" title="Add notes"><img src="/assets/client/theme/img/icon/pencil.png" alt="Add"></a>
                    </div>
                    <add-new-task v-if="componentData.addNew" :catId="data.id" :colorActive="dataNeedToSend.color" :index="index"></add-new-task>
                    <p v-if="data.description" class="alert alert-info" :data-related-description="index">{{data.description}}</p>
                    <div v-for="(data2,index2) in data.note">
                        <div :class="'alert btn-' + data2.color + ' parent-row'" :data-related-note="index+'-'+index2">
                            <p>{{data2.value}}</p>
                            <a class="icons" :data-color="data2.color" @click="editAction($event,'note')" title="Edit"><img src="/assets/client/theme/img/icon/eraser.png" alt="Edit"></a>
                            <a class="icons" :data-color="data2.color" @click="removeAction($event,'note')" title="Remove"><img src="/assets/client/theme/img/icon/scissors.png" alt="Remove"></a>
                            <a class="icons" :data-color="data2.color" @click="copyNote($event,'note')" title="copy"><img src="/assets/client/theme/img/icon/copy.png" alt="copy"></a>
                        </div>
                    </div>
                    <div>
                    <table v-if="data.task.length > 0" class="table text-right" style="direction: rtl">
                        <thead>
                            <tr class="btn-dark">
                                <th style="width: 144.2px;" width="144.2" scope="col" @click="sortInTaskTable($event,{type:'string'})" data-sort-table>Title</th>
                                <th style="width: 505.6px;" scope="col">Description</th>
                                <th style="width: 98.4px;" width="98.4" scope="col" @click="sortInTaskTable($event,{fixer:{count:3}})" data-sort-table>Time</th>
                                <th style="width: 88px" @click="sortInTaskTable($event,{fixer:{after:'%'}})" data-sort-table>progress</th>
                                <th style="width: 97.6px;" width="97.6" scope="col" @click="sortInTaskTable($event,{fixer:{count:3}})" data-sort-table>Done</th>
                                <th style="width: 201.4px;" width="201.4" scope="col">Tools</th>
                            </tr>
                        </thead>
                        <tbody>
<!--                            <tr v-if="sumValues(data.task,'NeedToStudy','number') > 0" class="btn-light" :data-related-task="index">-->
                            <tr class="btn-light" :data-related-task="index">
                                <th style="width: 144.2px;" width="144.2">Sum</th>
                                <th style="width: 505.6px;"><p>Sum Values</p></th>
                                <th style="width: 98.4px;" width="98.4" :title="hourMinute(sumValues(data.task,'NeedToStudy','number'))">{{sumValues(data.task,'NeedToStudy','number')}}</th>
                                <th style="width: 88px" :title="hourMinute((sumValues(data.task,'NeedToStudy','number')) - sumValues(data.task,'studied','array'))">{{percentValues(sumValues(data.task,'NeedToStudy','number'),sumValues(data.task,'studied','array'))}}%</th>
                                <th style="width: 97.6px;" width="97.6" :title="hourMinute(sumValues(data.task,'studied','array'))">{{sumValues(data.task,'studied','array')}}</th>
                                <th style="width: 201.4px;" width="201.4"></th>
                            </tr>
                            <tr v-for="(data2,index2) in data.task" v-if="data2.active" :class="'btn-' + data2.color" :data-related-task="index + '-' + index2">
                                <td style="width: 144.2px;" width="144.2">{{data2.topicName}}</td>
                                <td style="width: 505.6px;"><p>{{data2.description}}</p></td>
                                <td style="width: 98.4px;" width="98.4" :title="hourMinute(data2.NeedToStudy)">{{data2.NeedToStudy.toFixed(3)}}</td>
                                <td style="width: 88px" :title="hourMinute((data2.NeedToStudy - data2.studied.reduce((a, b) => a + b, 0)))">{{percentValues(data2.NeedToStudy,data2.studied.reduce((a, b) => a + b, 0))}}%</td>
                                <td style="width: 97.6px;" width="97.6" :title="hourMinute(data2.studied.reduce((a, b) => a + b, 0))">{{data2.studied.reduce((a, b) => a + b, 0).toFixed(3)}}</td>
                                <td style="width: 201.4px;" width="201.4">                           
                                    <a class="icons" :data-color="data2.color" @click="addAction($event,'task')" title="Add Time"><img :data-related-task="index + '-' + index2" src="/assets/client/theme/img/icon/schedule.png" alt="Add Done Time"></a>
                                    <a class="icons" :data-color="data2.color" @click="copyTask($event,'task')" title="copy"><img :data-related-task="index + '-' + index2" src="/assets/client/theme/img/icon/copy.png" alt="copy"></a>
                                    <a class="icons" :data-color="data2.color" @click="editAction($event,'task')" title="Edit Description"><img :data-related-task="index + '-' + index2" src="/assets/client/theme/img/icon/eraser.png" alt="Edit Description"></a>
                                    <a class="icons" :data-color="data2.color" @click="removeAction($event,'task')" title="Remove"><img :data-related-task="index + '-' + index2" src="/assets/client/theme/img/icon/scissors.png" alt="Remove"></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div>
                    </div>
                </collapse>
            </div>
            `,
        data: function () {
            return {
                dataFromCache : dataFromCache, // all data got from jsons
                dani: window.dani, // it's a library form myself
                VueHelpers: VueHelpers, // vue heplers
                config: config, // config general
                dataNeedToSend: {
                    "color" : "secondary"
                }, // data need to send to the server
                componentData: {
                    "addNew" : false,
                    "sum": {
                        "NeedToStudy" : 0,
                        "studied" : 0
                    }
                }
            }
        },
        methods: {
            addAction : function (event,value) {
                switch (value) {
                    case "note":
                        this.add__note(event,value);
                        break;
                    case "task":
                        this.add__taskTime(event,value);
                        break;

                }

            },
            add__note : function (event,value) {
                let thisV = this;
                /*** get index of category in mainCat ***/
                let id = parseInt(event.target.parentNode.getAttribute("data-related-" + value));

                /*** get data and send to server ***/
                // get text of value of user
                Swal.fire({
                    title: 'Type Your Text',
                    input: 'textarea',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    showLoaderOnConfirm: true,
                })
                // pack data to send server
                    .then((result) => {
                        if (result.value) {
                            let data = {
                                "id": thisV.dataFromCache.mainCat[id].id, // index of category on mainCat
                                "values": {
                                    "color": this.dataNeedToSend.color, // get color
                                    "value": result.value, // get text of value
                                },
                                "value": value, // it's show in which property on the category store
                            };
                            // send data to server
                            $.ajax({
                                method: "POST",
                                url: this.config.addresses.api,
                                data: {
                                    type: "mainCategory",
                                    subType: "add",
                                    which: value,
                                    data: data
                                }
                            })
                                .done(function( msg ) {
                                    msg = JSON.parse(msg);
                                    // if success data push to the array in mainCat JUST FOR SHOW ON THE PAGE
                                    if (msg.status === "success"){
                                        dataFromCache.mainCat[id][value].push(
                                            {
                                                "color": thisV.dataNeedToSend.color,
                                                "value": result.value,
                                            }
                                        );
                                        Swal.fire({
                                            icon: 'success',
                                            text: msg.message,
                                        })
                                    }
                                    // if get some error of server
                                    else {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Oops...',
                                            text: "Oops...",
                                        })
                                    }
                                });
                        }
                    });
            },
            add__taskTime: function (event,value) {
                let thisV = this;
                /*** get index of category on main json file and index of value in the category ***/
                let idArray = event.target.getAttribute("data-related-" + value).split("-");

                /*** ask text value and save them  ***/
                // get text of value
                Swal.fire({
                    title: 'Type Your Time, Not Plus Old Time',
                    // inputValue: message,
                    input: 'number',
                    inputAttributes: {
                        autocapitalize: 'off',
                        step: 0.001,
                        value: 0.016
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    showLoaderOnConfirm: true,
                }).then((result) => {
                    if (result.value) {
                        // create data need to send
                        let data = {
                            "id": {
                                "parent": thisV.dataFromCache.mainCat[idArray[0]].id, // index of category on
                                "child": idArray[1] // index of value text on category
                            },
                            "values": {
                                "value": result.value, // time of value wrote
                            },
                            "value": value, // it's show in which property on the category need to save
                        };

                        // send data to server
                        $.ajax({
                            method: "POST",
                            url: this.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "addTime",
                                which: value,
                                data: data
                            }
                        })
                        // after receive respond of server
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    // if success push data that save to the mainCat JUST FOR SHOW AND RENDER IN PAGE
                                    dataFromCache.mainCat[idArray[0]][value][idArray[1]].studied.push(parseFloat(result.value));
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    // if got some eror from server
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });

            },
            editAction : function (event,value) {
                switch (value) {
                    case "note":
                        this.edit__note(event,value);
                        break;
                    case "task":
                        this.edit__task(event,value);
                        break;

                }
            },
            edit__note: function (event,value) {
                let thisV = this;
                /*** get index of category on main json file and index of value in the category ***/
                let idArray = event.target.parentNode.parentNode.getAttribute("data-related-" + value).split("-");

                /*** get color choosen finaly ***/
                    // get list of colors
                let colorsElm = document.querySelectorAll(".add-main-category-parent-color-container [data-color]");

                //get color was set on this comes from server
                this.dataNeedToSend.color = event.target.parentNode.getAttribute("data-color");

                // check user click on a color in color-box components
                for (let i = 0 ; i < colorsElm.length ; i++){
                    if (colorsElm[i].classList.contains("add")){
                        this.dataNeedToSend.color = colorsElm[i].getAttribute("data-color");
                    }
                }

                /*** get value text before edit user wrote ***/
                let message = event.target.parentNode.parentNode.querySelector("p").innerText;

                /*** ask text value and save them  ***/
                // get text of value
                Swal.fire({
                    title: 'Type Your Text',
                    inputValue: message,
                    input: 'textarea',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    showLoaderOnConfirm: true,
                }).then((result) => {
                    if (result.value) {

                        // create data need to send
                        let data = {
                            "id": {
                                "parent": thisV.dataFromCache.mainCat[idArray[0]].id, // index of category on
                                "child": idArray[1] // index of value text on category
                            },
                            "values": {
                                "color": this.dataNeedToSend.color, // color choosen
                                "value": result.value, // text of value wrote
                            },
                            "value": value, // it's show in which property on the category need to save
                        };

                        // send data to server
                        $.ajax({
                            method: "POST",
                            url: this.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "edit",
                                which: value,
                                data: data
                            }
                        })
                        // after receive respond of server
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    // if success push data that save to the mainCat JUST FOR SHOW AND RENDER IN PAGE
                                    dataFromCache.mainCat[idArray[0]][value][idArray[1]].color = thisV.dataNeedToSend.color;
                                    dataFromCache.mainCat[idArray[0]][value][idArray[1]].value = result.value;
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    // if got some eror from server
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });

            },
            edit__task: function (event,value) {

                let thisV = this;
                /*** get index of category on main json file and index of value in the category ***/
                let idArray = event.target.getAttribute("data-related-" + value).split("-");

                /*** get color choosen finaly ***/
                    // get list of colors
                let colorsElm = document.querySelectorAll(".add-main-category-parent-color-container [data-color]");

                //get color was set on this comes from server
                this.dataNeedToSend.color = event.target.parentNode.getAttribute("data-color");

                // check user click on a color in color-box components
                for (let i = 0 ; i < colorsElm.length ; i++){
                    if (colorsElm[i].classList.contains("add")){
                        this.dataNeedToSend.color = colorsElm[i].getAttribute("data-color");
                    }
                }

                /*** get value text before edit user wrote ***/
                let message = event.target.parentNode.parentNode.parentNode.querySelector("p").innerText;

                /*** ask text value and save them  ***/
                // get text of value
                Swal.fire({
                    title: 'Type Your Description',
                    inputValue: message,
                    input: 'textarea',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
                    showLoaderOnConfirm: true,
                }).then((result) => {
                    if (result.value) {

                        // create data need to send
                        let data = {
                            "id": {
                                "parent": thisV.dataFromCache.mainCat[idArray[0]].id, // index of category on
                                "child": idArray[1] // index of value text on category
                            },
                            "values": {
                                "color": this.dataNeedToSend.color, // color choosen
                                "description": result.value, // text of value wrote
                            },
                            "value": value, // it's show in which property on the category need to save
                        };

                        // send data to server
                        $.ajax({
                            method: "POST",
                            url: this.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "edit",
                                which: value,
                                data: data
                            }
                        })
                        // after receive respond of server
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    // if success push data that save to the mainCat JUST FOR SHOW AND RENDER IN PAGE
                                    dataFromCache.mainCat[idArray[0]][value][idArray[1]].color = thisV.dataNeedToSend.color;
                                    dataFromCache.mainCat[idArray[0]][value][idArray[1]].description = result.value;
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    // if got some eror from server
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });

            },
            removeAction : function (event,value) {
                switch (value) {
                    case "note":
                        this.remove__note(event,value);
                        break;
                    case "task":
                        this.remove__task(event,value);
                        break;

                }
            },
            remove__note: function (event,value) {
                /*** get index of category an value in the category ***/
                let idArray = event.target.parentNode.parentNode.getAttribute("data-related-" + value);

                // data
                let data = {
                    "id": this.dataFromCache.mainCat[idArray.split("-")[0]].id,
                    "subId": idArray.split("-")[1],
                    "value": value
                };
                /*** get data from user to send ***/
                Swal.fire({
                    title: 'Are You Sure?',
                    text: "It's Can't Be Reverse",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            method: "POST",
                            url: this.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "remove",
                                which: value,
                                data: data
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[idArray.split("-")[0]][value].splice(data.subId, 1);
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });
            },
            remove__task: function (event,value) {
                /*** get index of category an value in the category ***/
                let idArray = event.target.getAttribute("data-related-" + value);

                // data
                let data = {
                    "id": this.dataFromCache.mainCat[idArray.split("-")[0]].id,
                    "subId": idArray.split("-")[1],
                    "value": value
                };
                /*** get data from user to send ***/
                Swal.fire({
                    title: 'Are You Sure?',
                    text: "It's Can't Be Reverse",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            method: "POST",
                            url: this.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "remove",
                                which: value,
                                data: data
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[idArray.split("-")[0]][value].splice(data.subId, 1);
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });
            },
            copyNote : function (event) {
                let thisV = this;
                let idArray = event.target.parentNode.parentNode.getAttribute("data-related-note").split("-");
                let data = {
                    "id": this.dataFromCache.mainCat[idArray[0]].id,
                    "subId": idArray[1]
                };
                let note = JSON.parse(JSON.stringify(dataFromCache.mainCat[idArray[0]]["note"][data.subId]));
                Swal.fire({
                    title: 'Are You Sure?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            method: "POST",
                            url: thisV.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "copy",
                                which: "note",
                                data: {
                                    id: data.id,
                                    subId: data.subId,
                                }
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[idArray[0]]["note"].push(note);
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });
            },
            copyTask : function (event) {
                let thisV = this;
                let idArray = event.target.getAttribute("data-related-task").split("-");
                let data = {
                    "id": this.dataFromCache.mainCat[idArray[0]].id,
                    "subId": idArray[1]
                };
                let note = JSON.parse(JSON.stringify(dataFromCache.mainCat[idArray[0]]["task"][data.subId]));
                Swal.fire({
                    title: 'Are You Sure?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.value) {

                        $.ajax({
                            method: "POST",
                            url: thisV.config.addresses.api,
                            data: {
                                type: "mainCategory",
                                subType: "copy",
                                which: "task",
                                data: {
                                    id: data.id,
                                    subId: data.subId,
                                }
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[idArray[0]]["task"].push(note);
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "Oops...",
                                    })
                                }
                            });
                    }
                });
            },
            activeColorClicked: function (event) {
                this.VueHelpers.activeColorClicked(event,this);
            },
            addNew: function () {
                this.componentData.addNew = !this.componentData.addNew;
            },
            sumValues : function (source,value,type) {
                let sum = 0 ;
                for (let i = 0 ; i < source.length ; i++){
                    if (type === "number"){
                        sum += parseFloat(source[i][value]);
                    }else if (type === "array"){
                        for (let j = 0 ; j < source[i][value].length ; j++){
                            sum += parseFloat(source[i][value][j]);
                        }
                    }
                }
                return sum.toFixed(3);
            },
            hourMinute: function (value) {

                value = parseFloat(value);
                let min = value * 60;

                let hour = 0;
                if (min > 60){
                    hour = Math.floor(min / 60);
                    min = ( min % 60 );
                }

                return hour + ":" + min.toFixed(0);
            },
            percentValues: function (target,value) {
                target = parseFloat(target);
                target === 0 ? target = 1 : "";
                value = parseFloat(value);
                return (( value * 100 ) / target).toFixed(0);
            },
            sortInTaskTable: function (event,config = {}) {
                const defaultConfig = {
                    type: "number",
                    fixer : {
                        after: null,
                        before: null,
                        count: null,
                    }
                };
                config = Object.assign(defaultConfig, config);
                const elm = event.target;
                let elmText;
                const parent = event.target.parentElement;
                const table = elm.parentElement.parentElement.parentElement;
                const childrenHeading = event.target.parentElement.querySelectorAll("th");
                const tbody = table.querySelector("tbody");
                const tbodyRow = table.querySelectorAll("tbody > tr");
                const dataSortElements = document.querySelectorAll("[data-sort-table]");
                let data = {
                    theIndex : null,
                    theTdInner : [],
                    sortDirection : "up"
                };

                if (elm.hasAttribute("data-sort-table")){

                    let span = elm.querySelector("span");
                    let dataSort = elm.getAttribute("data-sort-table");

                    data.sortDirection = dataSort;

                    if(dataSort === "up"){

                        span.innerHTML = "&#8595;";
                        elm.setAttribute("data-sort-table","down");
                        data.sortDirection = "down";

                    }else if(dataSort === "down"){

                        span.innerHTML = "&#8593;";
                        elm.setAttribute("data-sort-table","up");
                        data.sortDirection = "up";

                    }else {

                        elm.innerHTML += `<span>&#8593;</span>` ;
                        elm.setAttribute("data-sort-table","up");
                        data.sortDirection = "up";

                    }
                }

                elmText = elm.innerText;

                for (let i = 0 ; i < childrenHeading.length ; i++){
                    childrenHeading[i].innerText === elmText ? data.theIndex = i : "";
                }

                for (let i = 0 ; i < tbodyRow.length ; i++){

                    if (tbodyRow[i].innerHTML.includes("<td") && tbodyRow[i].innerHTML.includes("</td>")){
                        if (config.type === "number"){
                            data.theTdInner.push(parseFloat(tbodyRow[i].querySelectorAll("td")[data.theIndex].innerText));
                        }else if (config.type === "string"){
                            data.theTdInner.push(tbodyRow[i].querySelectorAll("td")[data.theIndex].innerText);
                        }

                    }

                }

                if (config.type === "number"){
                    if (data.sortDirection === "down"){
                        data.theTdInner.sort((a, b) => a - b);
                    }else if (data.sortDirection === "up"){
                        data.theTdInner.sort((a, b) => b - a);
                    }
                }else if (config.type === "string"){
                    if (data.sortDirection === "down"){
                        data.theTdInner.sort();
                    }else if (data.sortDirection === "up"){
                        data.theTdInner.sort().reverse();
                    }
                }


                if (config.fixer.after != null){
                    data.theTdInner.addAfter(config.fixer.after)
                }
                if (config.fixer.before != null){
                    data.theTdInner.addBefore(config.fixer.after)
                }
                if (config.fixer.count != null){
                    data.theTdInner.toFixed(config.fixer.count)
                }


                for (let i = 0 ; i < tbodyRow.length ; i++){

                    if (tbodyRow[i].innerHTML.includes("<td") && tbodyRow[i].innerHTML.includes("</td>")){
                        data.theTdInner.push();
                    }

                    for (let j = 0 ; j < data.theTdInner.length ; j++){
                        if (tbodyRow[i].innerHTML.includes("<td") && tbodyRow[i].innerHTML.includes("</td>")){
                            if (tbodyRow[i].querySelectorAll("td")[data.theIndex].innerText === data.theTdInner[j]){
                                tbodyRow[i].querySelectorAll("td")[data.theIndex].parentElement.style.order = j.toString();
                            }
                        }
                    }

                }

                if (!elm.classList.contains("active")){
                    dani.removeClass([{"selector": "[data-sort-table]", "class": "active"}]);
                    for(let i = 0 ; i < dataSortElements.length ; i++){
                        if (dataSortElements[i] !== elm){
                            if (dataSortElements[i].querySelector("span")){
                                dataSortElements[i].querySelector("span").innerText = "";
                            }
                        }
                    }
                    elm.classList.add("active");
                }

                table.style.display = "flex";
                table.style.flexDirection = "column";

                tbody.style.display = "flex";
                tbody.style.flexDirection = "column";

            }
        },
        computed : {

        }
    });


    document.getElementById("gitGuide").innerHTML = `
    <top-header></top-header>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <add-main-category></add-main-category>
                <div id="main-category">
                    <main-category></main-category>
                </div>
            </div>
        </div>
    </div>
    `;

    const gitGuide = new Vue({
        el: "#gitGuide",
    });
}