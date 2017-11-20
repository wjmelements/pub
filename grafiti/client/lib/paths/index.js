var filterAuthor = null;
var filterAuthorIndex = new ReactiveVar(0); // XXX
var onRendered = [];
function getAuthorLink() {
    // XXX
}
Index = {
    onEnter: function (context, redirect) {
        console.log("Index.onEnter");
        var path = context.path;
        if (path.startsWith('/browse/')) {
            filterAuthor = null;
            var index = parseInt(context.path.substring(8));
            //Pub.get(index, setCurrentIndex);
            BlazeLayout.reset();
            BlazeLayout.render('main', { main: "info", index:index });
            updateButtons(index);
        } else if (path.startsWith('/source/')) {
            var slashLoc = path.indexOf('/',8);
            
            var source = path.substring(8, slashLoc == -1 ? undefined : slashLoc);

            filterAuthor = source;
            if (slashLoc == -1) {
                Pub.getAuthorPublicationCount(source, function(address, count) {
                    filterAuthorIndex.set(count-1);
                    updateButtons();
                    //Pub.getLastBy(source, setCurrentIndex);
                });
            } else {
                var index = parseInt(path.substring(slashLoc + 1));
                filterAuthorIndex.set(index);
                Pub.getAuthorPublicationIndex(source,index, function(address, index) {
                    //Pub.get(index, setCurrentIndex);
                });
            }
        } else {
            filterAuthor = null;
            filterAuthorIndex.set(0);
            //Pub.getLast(setCurrentIndex);
        }
        onFilterAuthor();
    },
    onExit: function(context) {
        console.log("Index.onExit");
    },
};

var onRendered=[];
function onFilterAuthor() {
    var authorLink = document.getElementsByClassName('info-author')[0];
    if (authorLink == undefined) {
        onRendered.push(onFilterAuthor);
        return;
    }
    var compositionIndex = document.getElementsByClassName('all-index')[0];
    if (filterAuthor == undefined) {
        authorLink.href = getAuthorLink();
        compositionIndex.removeAttribute('href');
    } else {
        authorLink.removeAttribute('href');
        compositionIndex.href = '/browse/'+instance_index.get();
    }
}

function updateButtons(index) {
    var nextButton = document.getElementById("next");
    if (nextButton == null) {
        onRendered.push(function() {updateButtons(index);});
        return;
    }
    var prevButton = document.getElementById("prev");
    var authorIndex = document.getElementsByClassName("author-index")[0];
    if (filterAuthor) {
      console.log(filterAuthor);
      authorIndex.classList.remove("hidden");
      Pub.getAuthorPublicationCount(filterAuthor, function (source, count) {
          if (filterAuthorIndex.get() + 1 < count) {
            nextButton.href = "/source/"+filterAuthor+"/"+(filterAuthorIndex.get()+1);
          } else {
            nextButton.removeAttribute('href');
          }
          if (filterAuthorIndex.get() - 1 >= 0) {
            prevButton.href = "/source/"+filterAuthor+"/"+(filterAuthorIndex.get()-1);
          } else {
            prevButton.removeAttribute('href');
          }
      });
    } else {
      authorIndex.classList.add("hidden");
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

Template.info.onRendered(function () {
    while (onRendered.length > 0) {
        onRendered.pop()();
    }
});

Template.info.helpers({
    index() {
        console.log(this.index());
        return this.index();
    }
});
