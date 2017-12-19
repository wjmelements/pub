var formerLastIndex;
var lastLoad = new ReactiveVar(Infinity);
function initFeed(render) {
    Pub.getLastIndex(function(lastIndex) {
        if (formerLastIndex != lastIndex) {
            formerLastIndex = lastIndex;
            if (render) BlazeLayout.reset();
        }
        lastLoad.set(Math.max(0, Math.min(lastLoad.get(), lastIndex - 10)));
        if (render) {
            BlazeLayout.reset();
            BlazeLayout.render('main', { main:"feed", index:lastIndex });
        }
    });
}
function init(render) {
    if (this.filterAuthor.get()) {
        Pub.getAuthorPublicationCount(this.filterAuthor.get(), function(address, count) {
            lastLoad.set(Math.max(0, Math.min(lastLoad.get(), count - 10)));
        });
    } else {
        initFeed(render);
    }
}
function onResize() {
    init.bind(this)(true);
}
Feed = {
    onEnter: function (context, redirect) {
        console.log("Feed.onEnter");
        initFeed(true);
    },
    onExit: function (context, redirect) {
        console.log("Feed.onExit");
    },
};

Template.feeditem.onCreated(function() {
    this.index = new ReactiveVar(this.data.index);
    this.filterAuthorIndex = new ReactiveVar(this.data.filterAuthorIndex);
    this.filterAuthor = new ReactiveVar(this.data.filterAuthor);
    this.nextFilterAuthorIndex = new ReactiveVar(this.filterAuthorIndex.get() - 1);
    this.next = new ReactiveVar(-1);
    if (this.filterAuthor.get()) {
        if (this.nextFilterAuthorIndex.get() >= 0) {
            Pub.getAuthorPublicationIndex(this.filterAuthor.get(), this.nextFilterAuthorIndex.get(), function (address, index) {
                this.next.set(index);
            }.bind(this));
        }
    } else {
        this.next.set(this.index.get() - 1);
    }
});
Template.feeditem.helpers({
    hasNext() {
        return Template.instance().next.get() >= lastLoad.get();
    },
    next() {
        return Template.instance().next.get();
    },
    nextFilterAuthorIndex() {
        var next = Template.instance().nextFilterAuthorIndex.get();
        return next;
    },
    filterAuthor() {
        return Template.instance().filterAuthor.get();
    },
    filterAuthorIndex() {
        return Template.instance().filterAuthorIndex.get();
    },
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
function onChangeName() {
    var name = document.getElementById('sign-name').value;
    name = name || Template.instance().filterAuthor.get();
    $('.info-author').html(name);
}
function showTransactionHash(hash) {
    console.log(hash);
    document.getElementById('onSuccess').hidden = false;
    document.getElementById('success-etherscan').href = 'https://'+networkPrefix()+'etherscan.io/tx/'+hash;
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
    'change #sign-name'(event) {
        onChangeName();
    },
    'keyup #sign-name'(event) {
        onChangeName();
    },
    'click #sign-btn'(event) {
        var name = document.getElementById('sign-name').value;
        console.log(name);
        Pub.sign(name, function(result) {
            showTransactionHash(result);
        });
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
    this.filterAuthor = new ReactiveVar(this.data.filterAuthor ? this.data.filterAuthor() : undefined);
    this.onResize = onResize.bind(this);
    Pub.resizeSubscribe(this.onResize);
    init.bind(this)();
});
Template.feed.onDestroyed(function() {
    document.removeEventListener('scroll', onScroll);
    Pub.resizeUnsubscribe(this.onResize);
});
Template.feed.helpers({
    isMe() {
        var author = Template.instance().filterAuthor.get();
        return author && web3.eth.accounts[0] == author;
    }
});
