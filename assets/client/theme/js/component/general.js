var dataFromCache = {
    mainCat : "",
};

function getDataFromCache() {
    let random = Math.random();
    $.get("/assets/data/mainCat.json?" + random + "=" + random , function (data) {
        if (data.hasOwnProperty(undefined)){
            setTimeout( getDataFromCache,50)
        }else {
            dataFromCache.mainCat = data;
            run();
        }
    });
}

getDataFromCache();

function run(){
    Vue.component("collapse", {
        props: {
            id: {
                type: String,
                required: true
            },
            titleBtn: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            mainCatId: {
                type: Number,
                required: false
            },
            status:{
                type: String,
                required: true
            }
        },
        template: `
<section class="px-1" style="position: relative" :data-main-cat-id="mainCatId" :data-status="status">
    <div>
        <a class="btn btn-block my-3" :class="'btn-outline-'+color" :data-color="color" data-toggle="collapse" :href="'#'+id" role="button" aria-expanded="false" :aria-controls="id" @click="changeBtn()">
            {{titleBtn}}
        </a>
    </div>
    <div class="collapse" :id="id">
    <div class="card card-body">
        <slot></slot>
    </div>
    </div>
    <div v-if="mainCatId >= 0" class="remove-row icons">
        <a  @click="removeCollapseElm($event)" title="حذف"><img src="/assets/client/theme/img/icon/scissors.png" alt="حذف"></a>
        <a  @click="editCollapseElm($event)" title="ویرایش"><img src="/assets/client/theme/img/icon/eraser.png" alt="ویرایش"></a>
    </div>
</section>

        `,
        data: function () {
            return {
                dani : window.dani,
                dataFromCache: dataFromCache,
            }
        },
        methods: {
            changeBtn: function () {

                setTimeout(function () {
                    let elms = document.querySelectorAll("[aria-expanded]");
                    for (let i = 0; i < elms.length; i++) {
                        let ariaExpanded = elms[i].getAttribute("aria-expanded");
                        let color = elms[i].getAttribute("data-color");
                        if (ariaExpanded === "true") {
                            elms[i].classList.remove("btn-outline-" + color);
                            elms[i].classList.add("btn-" + color);
                        } else {
                            elms[i].classList.remove("btn-" + color);
                            elms[i].classList.add("btn-outline-" + color);
                        }
                    }
                }, 50);

            },
            removeCollapseElm : function (event) {
                let id = event.target.parentNode.getAttribute("data-main-cat-id");
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
                                subType: "remove",
                                data: {
                                    id: id
                                }
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat.splice(id, 1);
                                    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
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
            editCollapseElm : function (event) {
                let thisV = this;
                let parentElm = event.target.parentNode.parentNode.parentNode;
                let id = parentElm.getAttribute("data-main-cat-id");
                let message = parentElm.querySelector("div:first-child a").innerText;
                Swal.fire({
                    title: 'متن خود را درج کنید',
                    inputValue: message,
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
                        $.ajax({
                            method: "POST",
                            url: "/assets/admin/api.php",
                            data: {
                                type: "mainCategory",
                                subType: "edit",
                                data: {
                                    id: id,
                                    values: result.value
                                }
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat[id].title = result.value;
                                    Swal.fire({
                                        icon: 'success',
                                        text: msg.message,
                                    })
                                }else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Oops...',
                                        text: "مشکلی پیش آمده است",
                                    })
                                }
                            });
                    }
                });
            },
        }
    });
    Vue.component("top-header",{
        template: `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#">Dani pad :D</a>
            <div class=" navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/addCommand.php">add command</a>
                    </li>
                </ul>
                <form class="form-inline">
                <input class="form-control mr-sm-2" type="search" placeholder="live search" aria-label="Search" disabled>
                </form>
            </div>
        </nav>
        `
    });
    Vue.component("color-box",{
        props: {
          clickOn :{
              required : true
          }
        },
        template:`
        <div class="add-main-category-parent-color-container">
            <span @click="clickOn($event)" class="alert btn-secondary active" data-color="secondary"></span>
            <span @click="clickOn($event)" class="alert btn-danger" data-color="danger"></span>
            <span @click="clickOn($event)" class="alert btn-success" data-color="success"></span>
            <span @click="clickOn($event)" class="alert btn-primary" data-color="primary"></span>
            <span @click="clickOn($event)" class="alert btn-warning" data-color="warning"></span>
            <span @click="clickOn($event)" class="alert btn-info" data-color="info"></span>
            <span @click="clickOn($event)" class="alert btn-light" data-color="light"></span>
            <span @click="clickOn($event)" class="alert btn-dark" data-color="dark"></span>
        </div>
        `
    });
    if (typeof indexComponent === "function"){
        indexComponent();
    }

}

$(document).ready(function () {
    dani.activeLinkAsUrl([".navbar-nav a"]);

});




