var filterAuthor = null;
var filterAuthorIndex = new ReactiveVar(0);
Index = {
    onEnter: function (context, redirect) {
        console.log("Index.onEnter");
        if (typeof web3 == "undefined") {
            redirect("/about");
            return;
        }
        var path = context.path;
        if (path.startsWith('/browse/')) {
            filterAuthor = null;
            var index = parseInt(context.path.substring(8));
            Pub.get(index, setCurrentIndex);
        } else if (path.startsWith('/source/')) {
            var slashLoc = path.indexOf('/',8);
            
            var source = path.substring(8, slashLoc == -1 ? undefined : slashLoc);

            filterAuthor = source;
            if (slashLoc == -1) {
                Pub.getAuthorPublicationCount(source, function(address, count) {
                    filterAuthorIndex.set(count-1);
                    updateButtons();
                    Pub.getLastBy(source, setCurrentIndex);
                });
            } else {
                var index = parseInt(path.substring(slashLoc + 1));
                filterAuthorIndex.set(index);
                Pub.getAuthorPublicationIndex(source,index, function(address, index) {
                    Pub.get(index, setCurrentIndex);
                });
            }
        } else {
            filterAuthor = null;
            filterAuthorIndex.set(0);
            Pub.getLast(setCurrentIndex);
        }
        BlazeLayout.render('main', { main: "info" });
        onFilterAuthor();
    },
    onExit: function(context) {
        console.log("Index.onExit");
    },
};

function bytesToStr(bytes) {
    var str = "";
    for (var i = 2; i < bytes.length; i+=2) {
        str += String.fromCharCode(parseInt(bytes.substring(i, i+2), 16));
    }
    return str;
}

function bytesToBlob(bytes, sliceSize, contentType) {
    contentType = contentType || '';
    sliceSize = sliceSize || 2048;

    var byteCharacters = bytes;
    var byteArrays = [];
    for (var offset = 2; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length/2);
        for (var i = 0; i < slice.length; i+=2) {
            byteNumbers[i/2] = parseInt(slice.substring(i,i+2), 16);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

var onRendered=[];
function hidePubContentError() {
    var pubconerr= document.getElementById('pubconerr');
    if (pubconerr == undefined) {
        // if not yet renderd, will render as hidden
        return;
    }
    pubconerr.hidden = true;
}
function onFilterAuthor() {
    var authorLink = document.getElementById('info-author');
    if (authorLink == undefined) {
        onRendered.push(onFilterAuthor);
        return;
    }
    var compositionIndex = document.getElementById('all-index');
    if (filterAuthor == undefined) {
        authorLink.href = getAuthorLink();
        compositionIndex.removeAttribute('href');
    } else {
        authorLink.removeAttribute('href');
        compositionIndex.href = '/browse/'+instance_index.get();
    }
}
function setCurrentIndex(index, result) {
    console.log("setCurrentIndex("+index+")");
    content_error.set('');
    hidePubContentError();
    instance_index.set(index);
    onFilterAuthor();
    instance_title.set(result[2]);
    console.log(result[2].length + result[3].length);
    console.log(result);
    var imgView=document.getElementById('pubconimg');
    if (imgView == undefined) {
        onRendered.push(function() { setCurrentIndex(index, result)});
        return;
    }
    if (Media.isImg(result[2])) {
        console.log("img");
        imgView.src = window.URL.createObjectURL(bytesToBlob(result[3]), Media.contentType(result[2]));
        imgView.hidden=false;
        instance_content.set(undefined);
    } else {
        console.log("not img");
        imgView.removeAttribute('src');
        imgView.hidden=true;
        instance_content.set(bytesToStr(result[3]));
    }
    
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
            if (filterAuthor != address) {
                name = "Anonymous";
            } else {
                name = address;
            }
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
      var authorIndex = document.getElementById("author-index");
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
}

// these would be less global if we didn't have to preserve them between pages
var instance_title = new ReactiveVar("Loading...")
var instance_index = new ReactiveVar(0);
var instance_content = new ReactiveVar("");
var instance_authorName = new ReactiveVar("Loading...");
var instance_authorAddress = new ReactiveVar("");
var instance_authorUrl = new ReactiveVar("");
var content_error = new ReactiveVar("");

Template.info.onCreated(function () {
    console.log("onCreated");
    // TODO loading appearance
});

Template.info.onRendered(function () {
    console.log("onRendered");
    updateButtons();
    var imgView=document.getElementById('pubconimg');
    imgView.addEventListener('load', function() {
        console.log("img loaded");
    });
    imgView.addEventListener('error', function(e) {
        console.log("img load error");
        console.error(e);
        document.getElementById('pubconerr').hidden=false;
        content_error.set("Failed to load image." + Media.contentHelp(instance_title.get()));
    });
    while (onRendered.length > 0) {
        onRendered.pop()();
    }
});

function getAuthorLink() {
  return "/source/"+instance_authorAddress.get();
}

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
  authorInfo() {
    return instance_authorUrl.get();
  },
  contentError() {
    return content_error.get();
  },
  authorIndex() {
    return filterAuthorIndex.get();
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
