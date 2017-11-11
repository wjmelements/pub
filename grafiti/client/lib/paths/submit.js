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
var instance_preview;
var instance_preview_title;
function clearSubmission() {
    instance_title.value = '';
    instance_content.value = '';
}
function showTransactionHash(hash) {
    document.getElementById('onSuccess').hidden = false;
    document.getElementById('success-etherscan').href = 'https://'+networkPrefix()+'etherscan.io/tx/'+hash;
}

Template.submit.onRendered(function () {
    instance_title = document.getElementById('submit-title');
    instance_content = document.getElementById('submit-content');
    instance_preview = document.getElementById('submit-preview');
    instance_preview_title = document.getElementById('submit-preview-title');
});

function onChange() {
    instance_preview.innerHTML = instance_content.value;
}

function onChangeTitle() {
    var title = instance_title.value;
    if (title.length == 0) {
        title = "Preview";
    }
    instance_preview_title.innerHTML = title;
}

Template.submit.events({
    'click input#submit-submit'(event) {
        var title=instance_title.value;
        var content=instance_content.value;
        if (title.length == 0 || content.length == 0) {
            console.log("Skipping empty submission");
            return;
        } 
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
});
