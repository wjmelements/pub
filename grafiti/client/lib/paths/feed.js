Feed = {
    onEnter: function (context, redirect) {
        console.log("Feed.onEnter");
        Pub.getLastIndex(function(lastIndex) {
            console.log(lastIndex);
            BlazeLayout.render('main', { main:"feed", index:lastIndex });
        });
    },
    onExit: function (context, redirect) {
        console.log("Feed.onExit");
    },
};

Template.feed.onCreated(function() {
});
Template.feed.helpers({
    hasNext() {
        console.log('hasNext');
        return Template.instance().data.index() > 0;
    },
    next() {
        console.log('next');
        var next = Template.instance().data.index() - 1;
        return function(){return next};
    }
});
