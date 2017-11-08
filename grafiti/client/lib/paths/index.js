Index = {
    onEnter: function (context) {
        console.log("Index.onEnter");
        BlazeLayout.render('main', { main: "info" });
    },
    onExit: function(context) {
        console.log("Index.onExit");
    },
};
