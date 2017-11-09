FlowRouter.route('/', {
    triggersEnter: [Index.onEnter],
    triggersExit: [Index.onExit],
    action: function(params, queryParams) {
        console.log("routed:/");
    }
});
FlowRouter.route('/random', {
    triggersEnter: function (condext, redirect) {
        Pub.getRandomIndex(function (index) {
            redirect('/browse/'+index);
        });
    },
    triggersExit: [Index.onExit],
    action: function(params, queryParams) {
        console.log("routed:/random");
    }
});
FlowRouter.route('/browse/:entryId', {
    triggersEnter: [Index.onEnter],
    triggersExit: [Index.onExit],
    action: function(params, queryParams) {
        console.log("routed:/browse");
    }
});
FlowRouter.route('/about', {
    triggersEnter: [About.onEnter],
    triggersExit: [About.onExit],
    action: function(params, queryParams) {
        console.log("routed:/about");
    }
});
FlowRouter.route('/Submit', {
    triggersEnter: [Submit.onEnter],
    triggersExit: [Submit.onExit],
    action: function(params, queryParams) {
        console.log("routed:/about");
    }
});
