function indexComponent (){

    Vue.component("add-main-category",{
        template: `
            <div>
                <collapse :id="'add-main-category-parent'" :titleBtn="'افزودن موضوع اصلی'" :color="'primary'" :onClick="addNewMainCategory">
                    <div>
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
            }
        },

        methods: {
            addNewMainCategory: function (event) {
                let inputValue = document.querySelector("#add-main-category-parent input").value;
                let textareaValue = document.querySelector("#add-main-category-parent textarea").innerText;
                let data = {
                    "id":  dataFromCache.mainCat.length + 1,
                    "title": inputValue
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
                        console.log(msg.status);
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

        }

    });

    Vue.component("main-category",{
        template :
            `
            <div>
                <collapse v-for="(data,index) in dataFromCache.mainCat" :mainCatId="index" :key="data.id" :id="dani.randomCharacter(20)" :titleBtn="data.title" :color="'secondary'">
                    <div class="mb-2 text-right">
                        <a class="btn btn-outline-primary col-lg-2" :data-related-description="index" @click="addParts($event,'description')">افزودن توضیح</a>
                        <a class="btn btn-outline-success col-lg-2" :data-related-tips="index" @click="addParts($event,'tips')">افزودن نکته</a>
                    </div>
                    <div v-for="(data2,index2) in data.description">
                        <p class="alert alert-secondary parent-row" :data-related-description="index+'-'+index2">
                            {{data2}}
                            <a class="btn btn-danger" @click="removeParts($event,'description')">X</a>
                        </p>
                    </div>
                    <div v-for="(data2,index2) in data.tips">
                        <p class="alert alert-success parent-row" :data-related-tips="index+'-'+index2">
                        {{data2}}
                        <a class="btn btn-danger" @click="removeParts($event,'tips')">X</a>
                        </p>
                    </div>
                </collapse>
            </div>
            `,
        data: function () {
            return {
                dataFromCache : dataFromCache,
                dani: window.dani,
            }
        },
        methods: {
            addParts : function (event,value) {
                let id = parseInt(event.target.getAttribute("data-related-" + value));
                let text = value === "tips" ? "نکته" : "توضیح";
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
                    console.log(result);
                    if (result.value) {
                        let data = {
                            "id": id,
                            "description": result.value,
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
                                console.log(msg.status);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[id][value].push(result.value);
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
                console.log(id);
                let data = {
                    "id": id.split("-")[0],
                    "subId": id.split("-")[1],
                    "value": value
                };
                console.log(data);
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
                                console.log(msg.status);
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