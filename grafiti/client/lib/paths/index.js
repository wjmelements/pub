var onRendered = [];
Index = {
    onEnter: function (context, redirect) {
        console.log("Index.onEnter");
        var path = context.path;
        if (path.startsWith('/browse/')) {
            var index = parseInt(context.path.substring(8));
            //Pub.get(index, setCurrentIndex);
            BlazeLayout.reset();
            BlazeLayout.render('main', { main: "info", index:index });
            updateButtons(index);
        } else if (path.startsWith('/source/')) {
            var slashLoc = path.indexOf('/',8);
            
            var source = path.substring(8, slashLoc == -1 ? undefined : slashLoc);

            if (slashLoc == -1) {
                Pub.getAuthorPublicationCount(source, function(address, count) {
                    var authorIndex = count - 1;
                    Pub.getAuthorPublicationIndex(source, authorIndex, function(address, index) {
                        BlazeLayout.reset();
                        BlazeLayout.render('main', { main:"info", index:index, filterAuthor:source, filterAuthorIndex:authorIndex });
                        updateButtons(index, source, authorIndex);
                    });
                    //Pub.getLastBy(source, setCurrentIndex);
                });
            } else {
                var authorIndex = parseInt(path.substring(slashLoc + 1));
                Pub.getAuthorPublicationIndex(source,authorIndex, function(address, index) {
                    BlazeLayout.reset();
                    BlazeLayout.render('main', { main:"info", index:index, filterAuthor:source, filterAuthorIndex:authorIndex });
                    updateButtons(index, source, authorIndex);
                    //Pub.get(index, setCurrentIndex);
                });
            }
        } else {
            //Pub.getLast(setCurrentIndex);
        }
    },
    onExit: function(context) {
        console.log("Index.onExit");
    },
};

function updateButtons(index, filterAuthor, filterAuthorIndex) {
    var nextButton = document.getElementById("next");
    if (nextButton == null) {
        onRendered.push(function() {updateButtons(index,filterAuthor,filterAuthorIndex);});
        return;
    }
    var prevButton = document.getElementById("prev");
    var authorIndex = document.getElementsByClassName("author-index")[0];
    if (filterAuthor) {
      console.log(filterAuthor);
      authorIndex.classList.remove("hidden");
      Pub.getAuthorPublicationCount(filterAuthor, function (source, count) {
          if (filterAuthorIndex + 1 < count) {
            nextButton.href = "/source/"+filterAuthor+"/"+(filterAuthorIndex+1);
          } else {
            nextButton.removeAttribute('href');
          }
          if (filterAuthorIndex - 1 >= 0) {
            prevButton.href = "/source/"+filterAuthor+"/"+(filterAuthorIndex-1);
          } else {
            prevButton.removeAttribute('href');
          }
      });
    } else {
      console.log(filterAuthor);
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
