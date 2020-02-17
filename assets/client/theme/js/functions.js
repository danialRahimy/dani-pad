window.dani = {

    activeLinkAsUrl: function activeLinkAsUrl(elmsSelector) {

        // get pathname EX: https://iransamaneh.com/fa/news/12 , pathname is fa/news/12
        var path = location.pathname;
        console.log(path);
        for (var j = 0 ; j < elmsSelector.length ; j++){
            console.log(document.querySelectorAll( elmsSelector[j] ) );
            console.log( elmsSelector[j] );
            for (var i = 0 ; i < document.querySelectorAll(elmsSelector[j]).length ; i++){
                var href = document.querySelectorAll(elmsSelector[j])[i].getAttribute("href");

                if (href === path){
                    document.querySelectorAll(elmsSelector[j])[i].classList.add("active");
                }
            }
        }
    },
    // dani.activeLinkAsUrl([".className a",".className2 a"]);

    randomCharacter: function randomCharacter(count = 10) {
    let letters = {
        "lower": ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    };

    let outPut = "";

    for (let i = 0 ; i < count ; i++){
        outPut += letters.lower[Math.floor(Math.random() * 26 )];
    }
    return outPut;
},
    // dani.randomCharacter()

    activeContentPerLink: function activeContentPerLink(tabContainerSelector,tabContainerSelectorChild,ContentContainerSelector,ContentContainerSelectorChildCustomAttribute,className) {

    var id;

    function run() {
        for (var i = 0 ; i < document.querySelectorAll(tabContainerSelector + " " + tabContainerSelectorChild).length ; i++){
            document.querySelectorAll(tabContainerSelector + " " + tabContainerSelectorChild)[i].onclick = function () {
                removeActiveClass(tabContainerSelector + " " + tabContainerSelectorChild); // remove active class from all tabs
                removeActiveClass(ContentContainerSelector + " " + "[" + ContentContainerSelectorChildCustomAttribute + "]"); // remove active class from all content container
                run();
                id = this.getAttribute("id");
                this.classList.add(className);
                addActiveContent();
            }
        }
    }

    function addActiveContent() {
        for (var i = 0 ; i < document.querySelectorAll(ContentContainerSelector + " " + "[" + ContentContainerSelectorChildCustomAttribute + "]").length; i++){
            if (document.querySelectorAll(ContentContainerSelector + " " + "[" + ContentContainerSelectorChildCustomAttribute + "]")[i].getAttribute(ContentContainerSelectorChildCustomAttribute) === id){
                document.querySelectorAll(ContentContainerSelector + " " + "[" + ContentContainerSelectorChildCustomAttribute + "]")[i].classList.add(className);
            }
        }
    }

    function removeActiveClass(elmsSelector) {
        for (var i = 0 ; i < document.querySelectorAll(elmsSelector).length ; i++){
            document.querySelectorAll(elmsSelector)[i].classList.remove(className);
        }
    }

    run();

},
    // dani.activeContentPerLink(".tab","li",".row_custom2","data-id-relative","tab_active");


};