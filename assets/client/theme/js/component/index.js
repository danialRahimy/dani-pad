function indexComponent (){

    Vue.component("add-main-category",{
        template: `
            <div>
                <collapse :id="'add-main-category-parent'" :titleBtn="'افزودن موضوع اصلی'" :color="'primary'" :onClick="addNewMainCategory">
                    <div>
                        <color-box :clickOn="activeColorClicked"></color-box>
                        <input type="text" placeholder="عنوان" class="form-control mb-2">
                        <textarea placeholder="توضیحات" class="form-control"></textarea>
                        <a class="btn btn-block btn-success mt-2" @click="addNewMainCategory($event)">افزودن</a>
                    </div>
                </collapse>
            </div>
        `,

        data: function (){
            return {
                dani: window.dani,
                VueHelpers : VueHelpers,
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
                    "color": this.dataNeedToSend.color,
                    "description": textareaValue,
                    "values": [],
                };

                $.ajax({
                    method: "POST",
                    url: "/assets/admin/api.php",
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
                                // title: 'Oops...',
                                text: msg.message,
                                // footer: '<a href>Why do I have this issue?</a>'
                            })
                        }else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: "مشکلی پیش آمده است",
                                // footer: '<a href>Why do I have this issue?</a>'
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
                <collapse v-for="(data,index) in dataFromCache.mainCat" :mainCatId="index" :key="data.id" :id="dani.randomCharacter(20)" :titleBtn="data.title" :color="data.color">
                    <color-box :clickOn="activeColorClicked"></color-box>
                    <div class="mb-2 text-right">
                        <a class="btn btn-outline-primary" :data-related-values="index" @click="addParts($event,'values')">+</a>
                    </div>
                    <p class="alert alert-info" :data-related-description="index">{{data.description}}</p>
                    <div v-for="(data2,index2) in data.values">
                        <div :class="'alert btn-' + data2.color + ' parent-row'" :data-related-values="index+'-'+index2">
                            <p>{{data2.value}}</p>
                            <a class="btn btn-danger" @click="editParts($event,'values')">E</a>
                            <a class="btn btn-danger" @click="removeParts($event,'values')">D</a>
                        </div>
                    </div>
                </collapse>
            </div>
            `,
        data: function () {
            return {
                dataFromCache : dataFromCache,
                dani: window.dani,
                VueHelpers: VueHelpers,
                dataNeedToSend: {
                    "color" : "secondary"
                }
            }
        },
        methods: {
            addParts : function (event,value) {
                let thisV = this;
                let id = parseInt(event.target.getAttribute("data-related-" + value));
                let text = "متن" ;
                Swal.fire({
                    title: text + ' خود را درج کنید',
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'ثبت',
                    cancelButtonText: 'لغو',
                    showLoaderOnConfirm: true,
                }).then((result) => {
                    if (result.value) {
                        let data = {
                            "id": id,
                            "values": {
                                "color": this.dataNeedToSend.color,
                                "value": result.value,
                            },
                            "value": value,
                        };
                        $.ajax({
                            method: "POST",
                            url: "/assets/admin/api.php",
                            data: {
                                type: "mainCategory",
                                subType: "addParts",
                                data: data
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[id][value].push(
                                        {
                                            "color": thisV.dataNeedToSend.color,
                                            "value": result.value,
                                        }
                                    );
                                    Swal.fire({
                                        icon: 'success',
                                        // title: 'Oops...',
                                        text: msg.message,
                                        // footer: '<a href>Why do I have this issue?</a>'
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "مشکلی پیش آمده است",
                                        // footer: '<a href>Why do I have this issue?</a>'
                                    })
                                }
                            });
                    }
                });

            },
            editParts : function (event,value) {
                let thisV = this;
                let idArray = event.target.parentNode.getAttribute("data-related-" + value).split("-");
                let message = event.target.parentNode.querySelector("p").innerText;
                let text = "متن" ;
                Swal.fire({
                    title: text + ' خود را درج کنید',
                    inputValue: message,
                    input: 'textarea',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'ثبت',
                    cancelButtonText: 'لغو',
                    showLoaderOnConfirm: true,
                }).then((result) => {
                    if (result.value) {
                        let data = {
                            "id": {
                                "parent": idArray[0],
                                "child": idArray[1]
                            },
                            "values": {
                                "color": this.dataNeedToSend.color,
                                "value": result.value,
                            },
                            "value": value,
                        };
                        $.ajax({
                            method: "POST",
                            url: "/assets/admin/api.php",
                            data: {
                                type: "mainCategory",
                                subType: "editParts",
                                data: data
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[idArray[0]][value][idArray[1]].color = thisV.dataNeedToSend.color;
                                    dataFromCache.mainCat[idArray[0]][value][idArray[1]].value = result.value;
                                    Swal.fire({
                                        icon: 'success',
                                        // title: 'Oops...',
                                        text: msg.message,
                                        // footer: '<a href>Why do I have this issue?</a>'
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "مشکلی پیش آمده است",
                                        // footer: '<a href>Why do I have this issue?</a>'
                                    })
                                }
                            });
                    }
                });

            },
            removeParts : function (event,value) {
                let id = event.target.parentNode.getAttribute("data-related-" + value);
                let data = {
                    "id": id.split("-")[0],
                    "subId": id.split("-")[1],
                    "value": value
                };
                Swal.fire({
                    title: 'آیا از حذف این عبارت مطمئن هستید؟',
                    text: "غیر قابل بازگشت خواهد بود",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'بله مطمئنم',
                    cancelButtonText: 'خیر شک دارم'
                }).then((result) => {
                    if (result.value) {
                        $.ajax({
                            method: "POST",
                            url: "/assets/admin/api.php",
                            data: {
                                type: "mainCategory",
                                subType: "removeParts",
                                data: data
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[data.id][value].splice(data.subId, 1);
                                    Swal.fire({
                                        icon: 'success',
                                        // title: 'Oops...',
                                        text: msg.message,
                                        // footer: '<a href>Why do I have this issue?</a>'
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "مشکلی پیش آمده است",
                                        // footer: '<a href>Why do I have this issue?</a>'
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