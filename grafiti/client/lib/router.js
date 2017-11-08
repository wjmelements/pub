FlowRouter.route('/', {
    triggersEnter: [Index.onEnter],
    triggersExit: [Index.onExit],
    action: function(params, queryParams) {
        console.log("routed:/");
    }
});
FlowRouter.route('/about', {
    triggersEnter: [About.onEnter],
    triggersExit: [About.onExit],
    action: function(params, queryParams) {
        console.log("routed:/about");
    }
});
