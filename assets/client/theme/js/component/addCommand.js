function indexComponent (){

    Vue.component("test",{
        template :
            `
            <div >
                <collapse v-for="data in dataFromCache.mainCat" :key="data.id" :id="'toward'" :titleBtn="data.title" :color="'secondary'">
                    <div></div>
                </collapse>
            </div>                
            
            `,
        data: function () {
            return {
                dataFromCache : dataFromCache,
            }
        }
    });

    document.getElementById("gitGuide").innerHTML = `
    <top-header></top-header>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <test></test>
            </div>
        </div>
    </div>
    `;

    const gitGuide = new Vue({
        el: "#gitGuide",
    });
}