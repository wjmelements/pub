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
    var name="Loading...";// TODO maybe use spinner?
    instance_authorName.set(name);
    Pub.getAuthorName(address, function(address, name) {
        if (name === undefined || name == "") {
            name = "Anonymous";
        }
        instance_authorName.set(name);
    });
    var authorUrl="https://etherscan.io/address/"+address;
    instance_authorUrl.set(authorUrl);
    updateButtons();
}

function updateButtons() {
    var index = instance_index.get();
    var nextButton = document.getElementById("next");
    if (nextButton != null) {
      var prevButton = document.getElementById("prev");
      nextButton.enabled= index + 1 < Pub.size();
      nextButton.href="/browse/"+(index+1);
      prevButton.enabled= index - 1 >= 0;
      prevButton.href="/browse/"+(index-1);
    }
}

// these would be less global if we didn't have to preserve them between pages
var instance_title = new ReactiveVar("Loading...")
var instance_index = new ReactiveVar(0);
var instance_content = new ReactiveVar("");
var instance_authorName = new ReactiveVar("Loading...");
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
