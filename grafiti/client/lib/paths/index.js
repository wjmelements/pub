Index = {
    onEnter: function (context, redirect) {
        console.log("Index.onEnter");
        var path = context.path;
        if (path.startsWith('/browse/')) {
            var index = parseInt(context.path.substring(8));
            //Pub.get(index, setCurrentIndex);
            BlazeLayout.reset();
            BlazeLayout.render('main', { main: "info", index:index });
        } else if (path.startsWith('/source/')) {
            var slashLoc = path.indexOf('/',8);
            
            var source = path.substring(8, slashLoc == -1 ? undefined : slashLoc);

            if (slashLoc == -1) {
                Pub.getAuthorPublicationCount(source, function(address, count) {
                    var authorIndex = count - 1;
                    Pub.getAuthorPublicationIndex(source, authorIndex, function(address, index) {
                        BlazeLayout.reset();
                        BlazeLayout.render('main', { main:"feed", index:index, filterAuthor:source, filterAuthorIndex:authorIndex });
                    });
                });
            } else {
                var authorIndex = parseInt(path.substring(slashLoc + 1));
                Pub.getAuthorPublicationIndex(source,authorIndex, function(address, index) {
                    BlazeLayout.reset();
                    BlazeLayout.render('main', { main:"info", index:index, filterAuthor:source, filterAuthorIndex:authorIndex });
                    //Pub.get(index, setCurrentIndex);
                });
            }
        } else {
            //Pub.getLast(setCurrentIndex);
            console.error('unupported path: ' + context.path);
        }
    },
    onExit: function(context) {
        console.log("Index.onExit");
    },
};

function updateButtons() {
    var nextButton = document.getElementById("next");
    var prevButton = document.getElementById("prev");
    var authorIndex = document.getElementsByClassName("author-index")[0];
    var index = this.data.index();
    var filterAuthor = this.data.filterAuthor && this.data.filterAuthor();
    var filterAuthorIndex = this.data.filterAuthorIndex && this.data.filterAuthorIndex();
    if (filterAuthor) {
      console.log(filterAuthor);
      authorIndex.classList.remove("hidden");
      Pub.getAuthorPublicationCount(filterAuthor, function (source, count) {
          if (filterAuthorIndex + 1 < count) {
            nextButton.href = "/source/"+filterAuthor+"/"+(filterAuthorIndex+1);
            nextButton.parentElement.classList.remove('disabled');
          } else {
            nextButton.removeAttribute('href');
            nextButton.parentElement.classList.add('disabled');
          }
          if (filterAuthorIndex - 1 >= 0) {
            prevButton.href = "/source/"+filterAuthor+"/"+(filterAuthorIndex-1);
            prevButton.parentElement.classList.remove('disabled');
          } else {
            prevButton.removeAttribute('href');
            prevButton.parentElement.classList.add('disabled');
          }
      });
    } else {
      console.log(filterAuthor);
      authorIndex.classList.add("hidden");
      if (index + 1 < Pub.size()) {
        nextButton.href = "/browse/"+(index+1);
        nextButton.parentElement.classList.remove('disabled');
      } else {
        nextButton.removeAttribute('href');
        nextButton.parentElement.classList.add('disabled');
      }
      if (index - 1 >= 0) {
        prevButton.href = "/browse/"+(index-1);
        prevButton.parentElement.classList.remove('disabled');
      } else {
        prevButton.removeAttribute('href');
        prevButton.parentElement.classList.add('disabled');
      }
    }
}

Template.info.onCreated(function() {
    this.updateButtons = updateButtons.bind(this);
    Pub.resizeSubscribe(this.updateButtons);
});

Template.info.onDestroyed(function() {
    Pub.resizeUnsubscribe(this.updateButtons);
});

Template.info.onRendered(function () {
    this.updateButtons();
});

Template.info.helpers({
    index() {
        return this.index();
    }
});
