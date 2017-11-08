FlowRouter.route('/', {
    triggersEnter: [Index.onEnter],
    triggersExit: [Index.onExit],
    action: function(params, queryParams) {
        console.log("routed:/");
        console.log(params);
        console.log(queryParams);
    }
});
FlowRouter.route('/about', {
    triggersEnter: [About.onEnter],
    triggersExit: [About.onExit],
    action: function(params, queryParams) {
        console.log("routed:/about");
        console.log(params);
        console.log(queryParams);
    }
});
