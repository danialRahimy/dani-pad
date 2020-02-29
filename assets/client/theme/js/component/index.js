function indexComponent (){

    Vue.component("add-main-category",{
        template: `
            <div>
                <collapse :id="'add-main-category-parent'" :status="'s'" :titleBtn="'Add New Category'" :color="'primary'" :onClick="addNewMainCategory">
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
                function getID (){
                    let length = dataFromCache.mainCat.length;
                    let length2 = length;
                    length2 -= 1;
                    if (length > 0){
                        return ++dataFromCache.mainCat[length2].id;
                    }else {
                        return 1;
                    }
                }
                let data = {
                    "id":  getID (),
                    "title": inputValue,
                    "status": "inProgress",
                    "color": this.dataNeedToSend.color,
                    "description": textareaValue,
                    "values": [],
                };

                $.ajax({
                    method: "POST",
                    url: this.config.addresses.api,
                    data: {
                        type: "mainCategory",
                        subType: "add",
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
            }
        }

    });
    Vue.component("main-category",{
        template :
            `
            <div>
                <collapse v-for="(data,index) in dataFromCache.mainCat" :status="data.status" :mainCatId="index" :key="data.id" :id="dani.randomCharacter(20)" :titleBtn="data.title" :color="data.color">
                    <color-box :clickOn="activeColorClicked"></color-box>
                    <div class="mb-2 text-right">
                        <a class="icons" :data-related-values="index" @click="addParts($event,'values')" title="Add"><img src="/assets/client/theme/img/icon/pencil.png" alt="Add"></a>
                    </div>
                    <p v-if="data.description" class="alert alert-info" :data-related-description="index">{{data.description}}</p>
                    <div v-for="(data2,index2) in data.values">
                        <div :class="'alert btn-' + data2.color + ' parent-row'" :data-related-values="index+'-'+index2">
                            <p>{{data2.value}}</p>
                            <a class="icons" :data-color="data2.color" @click="editParts($event,'values')" title="Edit"><img src="/assets/client/theme/img/icon/eraser.png" alt="Edit"></a>
                            <a class="icons" :data-color="data2.color" @click="removeParts($event,'values')" title="Remove"><img src="/assets/client/theme/img/icon/scissors.png" alt="Remove"></a>
                        </div>
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
                } // data need to send to the server
            }
        },
        methods: {
            addParts : function (event,value) {
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
                                subType: "addParts",
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
            editParts : function (event,value) {

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
                                subType: "editParts",
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
            removeParts : function (event,value) {

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
                                subType: "removeParts",
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
            activeColorClicked: function (event) {
                this.VueHelpers.activeColorClicked(event,this);
            }
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