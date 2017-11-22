var formerLastIndex;
var lastLoad = new ReactiveVar(Infinity);
function init() {
    console.log("init");
    Pub.getLastIndex(function(lastIndex) {
        if (formerLastIndex != lastIndex) {
            formerLastIndex = lastIndex;
            BlazeLayout.reset();
        }
        lastLoad.set(Math.max(0, Math.min(lastLoad.get(), lastIndex - 10)));
        BlazeLayout.render('main', { main:"feed", index:lastIndex });
    });
}
Feed = {
    onEnter: function (context, redirect) {
        console.log("Feed.onEnter");
        Pub.resizeSubscribe(init);
        init();
    },
    onExit: function (context, redirect) {
        console.log("Feed.onExit");
    },
};


Template.feeditem.onCreated(function() {
    this.index = new ReactiveVar(this.data.index);
});
Template.feeditem.helpers({
    hasNext() {
        return Template.instance().index.get() > lastLoad.get();
    },
    next() {
        var next = Template.instance().index.get() - 1;
        return next;
    }
});
var lastRotation = 0;
function setRotation(refresh, deg) {
    refresh.style.webkitTransform = 'rotate('+deg+'deg)'; 
    refresh.style.mozTransform    = 'rotate('+deg+'deg)'; 
    refresh.style.msTransform     = 'rotate('+deg+'deg)'; 
    refresh.style.oTransform      = 'rotate('+deg+'deg)'; 
    refresh.style.transform       = 'rotate('+deg+'deg)'; 
    lastRotation = deg;
}
Template.feed.events({
    'mouseover #refresh'(event) {
        Pub.fetchSize();
        var refresh = event.target;
        setRotation(refresh, 360);
    },
    'mouseout #refresh'(event) {
        var refresh = event.target;
        setRotation(refresh, 0);
    },
    'click #refresh'(event) {
        Pub.fetchSize();
        var refresh = event.target;
        setRotation(refresh, lastRotation + 360);
    },
});

function onScroll() {
    var scrollingElement = document.scrollingElement;
    if (scrollingElement.scrollTop + scrollingElement.clientHeight >= scrollingElement.scrollHeight * .95) {
        lastLoad.set(Math.max(0, lastLoad.get() - 10));
    }
}
Template.feed.onCreated(function() {
    document.addEventListener('scroll', onScroll);
});
Template.feed.onDestroyed(function() {
    document.removeEventListener('scroll', onScroll);
});
