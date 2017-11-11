var hasEnteredIndex=false;
Index = {
    onEnter: function (context, redirect) {
        console.log("Index.onEnter");
        if (context.path.startsWith('/browse/')) {
            var index = parseInt(context.path.substring(8));
            Pub.get(index, setCurrentIndex);
        } else if (!hasEnteredIndex) {
            Pub.getLast(setCurrentIndex);
        }
        hasEnteredIndex = true;
        BlazeLayout.render('main', { main: "info" });
    },
    onExit: function(context) {
        console.log("Index.onExit");
    },
};

function setCurrentIndex(index, result) {
    console.log("setCurrentIndex("+index+")");
    instance_index.set(index);
    instance_title.set(result[1]);
    instance_content.set(result[2]);
    var address=result[0];
    instance_authorAddress.set(address);
    var name="Loading...";// TODO maybe use spinner?
    instance_authorName.set(name);
    setAuthorName();
    var authorUrl="https://"+networkPrefix()+"etherscan.io/address/"+address;
    instance_authorUrl.set(authorUrl);
    updateButtons();
}

function setAuthorName() {
    var address = instance_authorAddress.get();
    Pub.getAuthorName(address, function(address, name) {
        if (name === undefined || name == "") {
            name = "Anonymous";
        }
        instance_authorName.set(name);
    });
}

function onAuthorMouseover() {
    if (instance_authorName.get() == "Anonymous") {
        instance_authorName.set(instance_authorAddress.get());
    }
}

function onAuthorMouseout() {
    setAuthorName();
}

function updateButtons() {
    var index = instance_index.get();
    var nextButton = document.getElementById("next");
    if (nextButton != null) {
      var prevButton = document.getElementById("prev");
      // FIXME Pub.size() can be -1 here
      if (index + 1 < Pub.size()) {
        nextButton.href = "/browse/"+(index+1);
      } else {
        nextButton.removeAttribute('href');
      }
      if (index - 1 >= 0) {
        prevButton.href = "/browse/"+(index-1);
      } else {
        prevButton.removeAttribute('href');
      }
    }
}

// these would be less global if we didn't have to preserve them between pages
var instance_title = new ReactiveVar("Loading...")
var instance_index = new ReactiveVar(0);
var instance_content = new ReactiveVar("");
var instance_authorName = new ReactiveVar("Loading...");
var instance_authorAddress = new ReactiveVar("");
var instance_authorUrl = new ReactiveVar("");

Template.info.onCreated(function () {
    console.log("onCreated");
    // TODO loading appearance
});

Template.info.onRendered(function () {
    console.log("onRendered");
    updateButtons();
});

Template.info.helpers({
  index() {
    return instance_index.get();
  },
  title() {
    return instance_title.get();
  },
  content() {
    return instance_content.get();
  },
  authorName() {
    return instance_authorName.get();
  },
  authorUrl() {
    return instance_authorUrl.get();
  },
});

Template.info.events({
    'mouseover #info-author'(event) {
        onAuthorMouseover();
    },
    'mouseout #info-author'(event) {
        onAuthorMouseout();
    },
});
