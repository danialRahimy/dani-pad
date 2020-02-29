var dataFromCache = {
    mainCat : "",
};
var config = {
    addresses: {
        api: "/assets/admin/api.php"
    }
};
function getDataFromCache() {
    $.ajax({
        method: "POST",
        url: config.addresses.api,
        data: {
            type: "mainCategory",
            subType: "get",
        }
    })
        .done(function( data ) {
            data = JSON.parse(data);
            if (data.hasOwnProperty(undefined)) {
                setTimeout(getDataFromCache, 50)
            } else {
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
        <a  @click="removeCollapseElm($event)" title="Remove"><img src="/assets/client/theme/img/icon/scissors.png" alt="Remove"></a>
        <a  @click="editCollapseElm($event)" title="Edit"><img src="/assets/client/theme/img/icon/eraser.png" alt="Edit"></a>
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
                let id = event.target.parentNode.parentNode.parentNode.getAttribute("data-main-cat-id");
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
                            url: "/assets/admin/api.php",
                            data: {
                                type: "mainCategory",
                                subType: "remove",
                                data: {
                                    id: this.dataFromCache.mainCat[id].id
                                }
                            }
                        })
                            .done(function( msg ) {
                                msg = JSON.parse(msg);
                                if (msg.status === "success"){
                                    dataFromCache.mainCat.splice(id, 1);
                                    event.target.parentNode.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode.parentNode);
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
            editCollapseElm : function (event) {
                let thisV = this;
                let parentElm = event.target.parentNode.parentNode.parentNode;
                let id = parentElm.getAttribute("data-main-cat-id");
                let message = parentElm.querySelector("div:first-child a").innerText;
                Swal.fire({
                    title: 'Type Your Text',
                    inputValue: message,
                    input: 'text',
                    inputAttributes: {
                        autocapitalize: 'off'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Submit',
                    cancelButtonText: 'Cancel',
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
                                        text: "Oops...",
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
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#">Dani pad :D</a>
            <div class=" navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                </ul>
                <form class="form-inline">
                <input class="form-control mr-sm-2" type="search" placeholder="live search" aria-label="Search" disabled>
                </form>
            </div>
            </nav>
            <div class="px-3">
                <div data-direction="changeDirection">
                    <a @click="changeDirection($event)" data-direction="ltr" class="active">ltr</a>
                    <a @click="changeDirection($event)" data-direction="rtl">rtl</a>
                </div>
            </div>
        </div>
        `,
        data : function (){
            return {
                dani : window.dani,
                VueHelpers : VueHelpers,
            }
        },
        methods: {
            changeDirection: function (event) {
                let direction = event.target.getAttribute("data-direction");
                document.getElementsByTagName("body")[0].setAttribute("data-direction",direction);
                dani.removeClass([{"selector": "[data-direction=changeDirection] [data-direction]", "class": "active"}]);
                event.target.classList.add("active");
                var d = new Date();
                d.setTime(d.getTime() + (1000*24*60*60*1000));
                var expires = "expires=" + d.toGMTString();
                document.cookie = "direction=" + direction + ";expires=" + expires + ";path=/";
            }
        },
        mounted: function () {
            VueHelpers.manageCookie();
        }

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




