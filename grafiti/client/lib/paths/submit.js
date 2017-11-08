Submit = {
    onEnter: function (context) {
        console.log("Submit.onEnter");
        BlazeLayout.render('main', { main: "submit" });
    },
    onExit: function(context) {
        console.log("Submit.onExit");
    },
};
