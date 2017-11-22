About = {
    onEnter: function (context) {
        console.log("About.onEnter");
        BlazeLayout.render('main', { main: "about" });
    },
    onExit: function(context) {
        console.log("About.onExit");
    },
};

