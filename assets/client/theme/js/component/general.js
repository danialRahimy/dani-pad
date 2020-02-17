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
            }
        },
        template: `
<section class="px-1" style="position: relative" :data-main-cat-id="mainCatId">
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
    <div v-if="mainCatId >= 0" class="remove-row" @click="removeCollapseElm($event)">X</div>
</section>

        `,
        data: function () {
            return {
                dani : window.dani
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
                console.log(event.target.parentNode);
                let id = event.target.parentNode.getAttribute("data-main-cat-id");

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
                        console.log(msg.status);
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
        }
    });
    Vue.component("top-header",{
        template: `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a class="navbar-brand" href="#">git guide</a>
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

    if (typeof indexComponent === "function"){
        indexComponent();
    }

}

$(document).ready(function () {
    dani.activeLinkAsUrl([".navbar-nav a"]);

});




