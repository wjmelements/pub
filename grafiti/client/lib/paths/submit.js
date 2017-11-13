Submit = {
    onEnter: function (context) {
        console.log("Submit.onEnter");
        BlazeLayout.render('main', { main: "submit" });
    },
    onExit: function(context) {
        console.log("Submit.onExit");
    },
};

var instance_title;
var instance_content;
var instance_preview = new ReactiveVar('');
var instance_preview_title;
function clearSubmission() {
    console.log('clearSubmission');
    fileBytes = undefined;
    instance_title.value = '';
    instance_content.value = '';
    document.getElementById('submit-file').value = '';
    document.getElementById('submit-preview-img').removeAttribute('src');
    instance_content.removeAttribute('readonly');
}
function showTransactionHash(hash) {
    document.getElementById('onSuccess').hidden = false;
    document.getElementById('success-etherscan').href = 'https://'+networkPrefix()+'etherscan.io/tx/'+hash;
}

Template.submit.onRendered(function () {
    instance_title = document.getElementById('submit-title');
    instance_content = document.getElementById('submit-content');
    instance_preview_title = document.getElementById('submit-preview-title');
});

var fileBytes;
function onChange() {
    if (fileBytes != undefined) {
        return;
    }
    instance_preview.set(instance_content.value);
}

Template.submit.helpers({
  preview() {
    return instance_preview.get();
  }
});

function onChangeTitle() {
    var title = instance_title.value;
    if (title.length == 0) {
        title = "Preview";
    }
    instance_preview_title.innerHTML = title;
}

function strToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = b64Data;
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

function onChangeFile() {
    var fileSubmitter = document.getElementById('submit-file');
    var file = fileSubmitter.files[0];
    console.log(file);
    if (file == undefined) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function() {
        var arrayBuffer = this.result;
        console.log("onload");
        var array = new Uint8Array(arrayBuffer);
        // FIXME array too long can stack overflow
        var binaryString = String.fromCharCode.apply(null, array);
        fileBytes = binaryString;
        instance_content.value = binaryString;
        instance_content.setAttributeNode(document.createAttribute('readonly'));
        if (Media.isImg(file.name)) {
            document.getElementById('submit-preview-img').src = window.URL.createObjectURL(strToBlob(binaryString));
            instance_preview.set('');
        } else {
            instance_preview.set(binaryString);
        }
    };
    reader.readAsArrayBuffer(file);
    instance_title.value = file.name;
    onChangeTitle();
    instance_content.value = "Loading...";
    onChange();
}

Template.submit.events({
    'click input#submit-submit'(event) {
        var title=instance_title.value;
        if (fileBytes != undefined) {
            console.log("publication size: " + fileBytes.length);
            Pub.publishBytes(title, fileBytes, function(result) {
                console.log("Transaction hash: " + result);
                clearSubmission();
                showTransactionHash(result);
            });
            return;
        }
        var content=instance_content.value;
        if (title.length == 0 || content.length == 0) {
            console.log("Skipping empty submission");
            return;
        } 
        console.log("publication size: " + content.length);
        console.log(content);
        Pub.publish(title, content, function(result) {
            console.log("Transaction hash: " + result);
            clearSubmission();
            showTransactionHash(result);
        });
    },
    'keyup textarea#submit-content'(event) {
        onChange();
    },
    'change textarea#submit-content'(event) {
        onChange();
    },
    'keyup #submit-title'(event) {
        onChangeTitle();
    },
    'change #submit-title'(event) {
        onChangeTitle();
    },
    'change #submit-file'(event) {
        onChangeFile();
    },
    'click input#submit-reset'(event) {
        clearSubmission();
    },
});
