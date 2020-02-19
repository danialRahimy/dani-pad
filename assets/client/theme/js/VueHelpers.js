let VueHelpers = {
    activeColorClicked: function (event,thisV) {
    dani.removeClass(
        [
            {
                "selector" : ".add-main-category-parent-color-container [data-color]",
                "class" : "active",
            }
        ]
    );
    event.target.classList.add("active");
    thisV.dataNeedToSend.color = event.target.getAttribute("data-color");
    },

};
