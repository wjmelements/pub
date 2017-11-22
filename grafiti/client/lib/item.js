// hardcoded utf8
function bytesToStr(bytes) {
    var str = "";
    for (var i = 2; i < bytes.length; i+=2) {
        var codePoint = parseInt(bytes.substring(i, i+2), 16);
        if (codePoint >= 128) {
            i+=2;
            codePoint -= 192;
            codePoint <<= 6;
            codePoint |= parseInt(bytes.substring(i, i+2), 16)-128;
            if (codePoint >= 2048) {
                i+=2;
                codePoint -= 2048;
                codePoint <<= 6;
                codePoint |= parseInt(bytes.substring(i, i+2), 16)-128;
                if (codePoint >= 65536) {
                    i+=2;
                    codePoint -= 65536
                    codePoint <<= 6;
                    codePoint |= parseInt(bytes.substring(i, i+2), 16)-128;
                }
            }
        }
        str += String.fromCodePoint(codePoint);
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

function hidePubContentError() {
    if (this.pubconerr == undefined) {
        // if not yet renderd, will render as hidden
        return;
    }
    this.pubconerr.hidden = true;
}

function setCurrentIndex(index, result) {
    console.log("setCurrentIndex("+index+")");
    this.contentError.set('');
    hidePubContentError.bind(this)();
    this.title.set(result[2]);
    console.log(result[2].length + result[3].length / 2 - 1);
    if (this.imgView == undefined) {
        this.onRendered.push(function() { setCurrentIndex.bind(this)(index, result);}.bind(this));
        return;
    }
    if (Media.isImg(result[2])) {
        console.log("loading img");
        this.imgView.src = window.URL.createObjectURL(bytesToBlob(result[3]), Media.contentType(result[2]));
        this.imgView.hidden=false;
        this.content.set(undefined);
    } else {
        this.imgView.removeAttribute('src');
        this.imgView.hidden=true;
        this.content.set(bytesToStr(result[3]));
    }
    
    var address=result[0];
    this.authorAddress.set(address);
    var name="Loading...";// TODO maybe use spinner?
    this.authorName.set(name);
    setAuthorName.bind(this)();
    var authorUrl="https://"+networkPrefix()+"etherscan.io/address/"+address;
    this.authorUrl.set(authorUrl);
    onFilterAuthor.bind(this)();
}

function setAuthorName() {
    var address = this.authorAddress.get();
    Pub.getAuthorName(address, function(address, name) {
        if (name === undefined || name == "") {
            if (this.filterAuthor != address) {
                name = "Anonymous";
            } else {
                name = address;
            }
        }
        this.authorName.set(name);
    }.bind(this));
}

function onAuthorMouseover() {
    if (this.authorName.get() == "Anonymous") {
        this.authorName.set(this.authorAddress.get());
    }
}

function onAuthorMouseout() {
    setAuthorName.bind(this)();
}

function onFilterAuthor() {
    var authorLink = this.infoAuthor;
    if (authorLink == undefined) {
        this.onRendered.push(onFilterAuthor.bind(this));
        return;
    }
    var compositionIndex = this.overallIndex;
    if (this.filterAuthor == undefined) {
        authorLink.href = getAuthorLink.bind(this)();
        compositionIndex.removeAttribute('href');
    } else {
        authorLink.removeAttribute('href');
        compositionIndex.href = '/browse/'+this.index;
    }
}

Template.item.onCreated(function () {
    this.onRendered = [];
    console.log("onCreated");
    this.title = new ReactiveVar("Loading...");
    this.content = new ReactiveVar("");
    this.authorName = new ReactiveVar("Loading...");
    this.authorUrl = new ReactiveVar("");
    this.authorAddress = new ReactiveVar("");
    this.contentError = new ReactiveVar("");
    console.log(this.data);
    this.filterAuthorIndex = this.data.filterAuthorIndex;
    this.filterAuthor = this.data.filterAuthor;
    this.index = this.data.index;
    Pub.get(this.index, setCurrentIndex.bind(this));
    // TODO loading appearance
});

Template.item.onRendered(function () {
    console.log("onRendered");
    this.contentErrorDiv = this.find('.pubconerr');
    this.imgView = this.find('.pubconimg');
    this.imgView.addEventListener('load', function() {
        console.log("img loaded");
    });
    this.imgView.addEventListener('error', function(e) {
        console.log("img load error");
        console.error(e);
        this.contentErrorDiv.hidden=false;
        this.contentError.set("Failed to load image." + Media.contentHelp(this.title.get()));
    }.bind(this));
    this.overallIndex = this.find('.all-index');
    this.authorIndex = this.find('.author-index');
    this.infoAuthor = this.find('.info-author');
    while (this.onRendered.length > 0) {
        this.onRendered.pop()();
    }
});

function getAuthorLink() {
  return "/source/"+this.authorAddress.get();
}

Template.item.helpers({
  index() {
    return Template.instance().index;
  },
  title() {
    return Template.instance().title.get();
  },
  content() {
    return Template.instance().content.get();
  },
  authorName() {
    return Template.instance().authorName.get();
  },
  authorInfo() {
    return Template.instance().authorUrl.get();
  },
  contentError() {
    return Template.instance().contentError.get();
  },
  authorIndex() {
    return Template.instance().filterAuthorIndex;
  },
});

Template.item.events({
    'mouseover .info-author'(event) {
        onAuthorMouseover.bind(Template.instance())();
    },
    'mouseout .info-author'(event) {
        onAuthorMouseout.bind(Template.instance())();
    },
});
