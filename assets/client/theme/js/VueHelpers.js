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

};
