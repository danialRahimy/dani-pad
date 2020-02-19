window.dani = {

    activeLinkAsUrl: function activeLinkAsUrl(elmsSelector) {

        // get pathname EX: https://iransamaneh.com/fa/news/12 , pathname is fa/news/12
        var path = location.pathname;
        for (var j = 0 ; j < elmsSelector.length ; j++){
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

    /**********
     *
     * @param tagName     // required // for example div, span, ...
     * @param id
     * @param classes     for multi classes just space between them "class1 class2 class3 class4 ..."
     * @param inner       can be a text or a html tag that can be create by HTMLTag()
     * @param attributes  use like this // [{"name": "type", "value": "text"},{"name": "dir", "value": "rtl"}]
     * @constructor
     */
    HTMLTag: function HTMLTag(tagName,id,classes,inner,attributes) {


        this.tagName = tagName;
        this.classes = classes;
        this.id = id;
        this.inner = inner;
        this.attributes = attributes;
        this.outPut = "";
        this.attr = [];
        const thisV = this;

        this.func = function () {

            return {
                "exist": function (value){
                    let done = true;
                    if (value === undefined){
                        done = false;
                    }
                    if (value === null){
                        done = false;
                    }
                    if (value === ""){
                        done = false;
                    }
                    return {
                        "bool": done,
                        "value": function () {
                            if (done)
                                return value;
                            else
                                return ""
                        }
                    }
                },
                /***
                 *
                 * @param tagName
                 * @param attr
                 * @param inner
                 */
                "baseTag": function (tagName, attr, inner) {
                    const singleTag = ["img","input"];
                    let isSingleTag = false;

                    tagName = this.exist(tagName).value();
                    attr = this.exist(attr).value();
                    inner = this.exist(inner).value();

                    for (let i = 0 ; i < singleTag.length ; i++){
                        if (tagName === singleTag[i]){
                            isSingleTag = true;
                        }
                    }
                    if (isSingleTag){
                        thisV.outPut = document.createElement(thisV.tagName);
                        for (let i = 0 ; i < thisV.attr.length ; i++){
                            thisV.outPut.setAttribute(thisV.attr[i].name,thisV.attr[i].value)
                        }

                        return thisV.outPut;
                    } else{
                        thisV.outPut = document.createElement(thisV.tagName);
                        for (let i = 0 ; i < thisV.attr.length ; i++){
                            thisV.outPut.setAttribute(thisV.attr[i].name,thisV.attr[i].value)
                        }
                        if (inner.type === "html"){
                            for (let i = 0 ; i < inner.value.length ; i++){
                                thisV.outPut.appendChild(inner.value[i])
                            }
                        }else if(inner.type === "text"){
                            thisV.outPut.innerText = inner.value;
                        }
                        return thisV.outPut;
                    }

                },
                "addAttr" : function (name,value) {
                    return {
                        "name" : name,
                        "value": value
                    }
                }
            }
        };

        if (this.func().exist(this.tagName).bool){

            this.outPut = this.func().baseTag(this.tagName);

            if (this.func().exist(this.inner).bool){
                this.outPut = this.func().baseTag(this.tagName,"",this.inner);
            }

            if (this.func().exist(this.id).bool){
                this.attr.push(this.func().addAttr("id", this.id));
            }

            if (this.func().exist(this.classes).bool){
                this.attr.push(this.func().addAttr("class", this.classes));
            }

            if (this.func().exist(this.attributes).bool){
                for (var i = 0 ; i < this.attributes.length ; i++){
                    this.attr.push(this.func().addAttr(this.attributes[i].name, this.attributes[i].value));
                }
            }

            if (this.func().exist(this.attr).bool && this.func().exist(this.inner).bool){
                this.outPut = this.func().baseTag(this.tagName,this.attr,this.inner);
            }else if(this.func().exist(this.attr).bool){
                this.outPut = this.func().baseTag(this.tagName,this.attr);
            }else if(this.func().exist(this.inner).bool){
                this.outPut = this.func().baseTag(this.tagName,"",this.inner);
            }

        }

    },
    // let spanTag = new HTMLTag("span", "", "", "متن داخل اسپن"),
    // divTag  = new HTMLTag("div", "tag-id", "class1 class2 class3", spanTag.outPut);
    // document.getElementById("parent").innerHTML = divTag.outPut;

    removeClass : function removeClass (values) {
        for (var i = 0 ; i < values.length ; i++){
            var elms = document.querySelectorAll(values[i].selector);
            for (var j = 0 ; j < elms.length ; j++){
                if (elms[j].classList.contains(values[i].class)){
                    elms[j].classList.remove(values[i].class);
                }
            }
        }
    },
    // removeClass([{"selector": "#IDName", "class": "className"}]);

};