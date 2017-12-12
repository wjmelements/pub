Submit = {
    onEnter: function (context) {
        console.log("Submit.onEnter");
        BlazeLayout.render('main', { main: "submit" });
    },
    onExit: function(context) {
        console.log("Submit.onExit");
        clearState();
    },
};

var bytesLimit = 9100;

var instance_title;
var instance_content;
var instance_preview = new ReactiveVar('');
var instance_preview_title;
var fileBytes;
function clearState() {
    fileBytes = undefined;
}
function clearSubmission() {
    console.log('clearSubmission');
    clearState();
    instance_title.value = '';
    instance_content.value = '';
    document.getElementById('submit-file').value = '';
    document.getElementById('submit-preview-img').removeAttribute('src');
    instance_content.removeAttribute('readonly');
    document.getElementById('too-large').hidden = true;
    onChange();
    onChangeTitle();
}
function checkAccount(refreshId) {
    var hasWeb3 = (typeof web3 !== 'undefined') && (typeof web3.currentProvider.host === 'undefined');
    var hasAccount = hasWeb3 && web3 && web3.eth && web3.eth.accounts && (web3.eth.accounts.length > 0);
    console.log("hasWeb3:"+hasWeb3+",hasAccount:"+hasAccount);
    document.getElementById("withoutweb3").hidden = hasWeb3;
    document.getElementById("withoutaccount").hidden = !hasWeb3 || hasAccount;
    if (hasAccount) {
        clearInterval(refreshId);
    } else if (!refreshId) {
        var refreshIndirect = [];
        refreshIndirect.push(setInterval(function () {
            checkAccount(refreshIndirect[0]);
        }, 2000));
    }
}
function showTransactionHash(hash) {
    document.getElementById('onSuccess').hidden = false;
    document.getElementById('success-etherscan').href = 'https://'+networkPrefix()+'etherscan.io/tx/'+hash;
}
var onRendered = [];
Template.submit.onRendered(function () {
    instance_title = document.getElementById('submit-title');
    instance_content = document.getElementById('submit-content');
    instance_preview_title = document.getElementById('submit-preview-title');
    onChange();
    onChangeTitle();
    checkAccount();
    while (onRendered.length > 0) {
        onRendered.pop()();
    }
});

function estimateGas(bytes) {
    var bytesInput = document.getElementsByClassName('custom-bytes')[0];
    if (!bytesInput) {
        onRendered.push(function(){estimateGas(bytes);});
        return;
    }
    bytesInput.value = bytes;
    Gas.onTableChange();
}

function onChange() {
    if (fileBytes != undefined) {
        return;
    }
    document.getElementById('too-large').hidden = instance_content.value.length <= bytesLimit;
    instance_preview.set(instance_content.value);
    estimateGas(instance_title.value.length + instance_content.value.length);
}

Template.submit.helpers({
  preview() {
    return instance_preview.get();
  },
  index() {
    return Pub.size();
  }
});

function onChangeTitle() {
    var title = instance_title.value;
    if (title.length == 0) {
        title = "Untitled";
    }
    instance_preview_title.innerHTML = title;
    estimateGas(instance_title.value.length + (fileBytes && fileBytes.length || instance_content.value.length));
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
        if (array.length > bytesLimit) {
            document.getElementById('too-large').hidden = false;
            return;
        }
        document.getElementById('too-large').hidden = true;
        // FIXME array too long can stack overflow
        var binaryString = String.fromCharCode.apply(null, array);
        fileBytes = binaryString;
        instance_content.value = binaryString;
        instance_content.setAttributeNode(document.createAttribute('readonly'));
        if (Media.isImg(file.name)) {
            document.getElementById('submit-preview-img').src = window.URL.createObjectURL(strToBlob(binaryString));
            instance_preview.set('');
        } else {
            document.getElementById('submit-preview-img').removeAttribute('src');
            instance_preview.set(binaryString);
        }
        estimateGas(instance_title.value.length + fileBytes.length);
    };
    reader.readAsArrayBuffer(file);
    instance_title.value = file.name;
    onChangeTitle();
    instance_content.value = "Loading...";
    onChange();
}

Template.submit.events({
    'click #submit-submit'(event) {
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
    'click #submit-reset'(event) {
        clearSubmission();
    },
});
