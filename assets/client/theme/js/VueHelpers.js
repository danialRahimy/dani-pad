let VueHelpers = {
    activeColorClicked: function (event,thisV) {
    dani.removeClass(
        [
            {
                "selector" : ".add-main-category-parent-color-container [data-color]",
                "class" : "active",
            },
            {
                "selector" : ".add-main-category-parent-color-container [data-color]",
                "class" : "add",
            }
        ]
    );
    event.target.classList.add("active");
    event.target.classList.add("add");
    thisV.dataNeedToSend.color = event.target.getAttribute("data-color");
    },
    markAsDone: function (event,thisV) {
        return {
            category: function (event,thisV) {

            },
            note : function (event,thisV) {

            }
        }
    },

    manageCookie : function () {
        // set direction
        let cookieDirection = dani.getAllCookie("direction");
        if (!dani.empty(cookieDirection)){
            document.getElementsByTagName("body")[0].setAttribute("data-direction",cookieDirection);
            dani.removeClass([{"selector": "[data-direction=changeDirection] [data-direction]", "class": "active"}]);
            document.querySelector("[data-direction=changeDirection] [data-direction=" + cookieDirection + "]").classList.add("active");
        }

    }

};
