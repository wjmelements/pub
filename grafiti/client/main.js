import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

function setInstanceCurrent(instance, index, result) {
    instance.index.set(index);
    instance.title.set(result[1]);
    instance.content.set(result[2]);
    var address=result[0];
    var name="Loading...";// TODO maybe use spinner?
    instance.authorName.set(name);
    Pub.getAuthorName(address, function(address, name) {
        if (name === undefined || name == "") {
            name = "Anonymous";
        }
        instance.authorName.set(name);
    });
    var authorUrl="https://etherscan.io/address/"+address;
    instance.authorUrl.set(authorUrl);
}

Template.info.onCreated(function helloOnCreated() {
  // TODO loading appearance
  this.title = new ReactiveVar("Loading...");
  this.index = new ReactiveVar(0);
  this.content = new ReactiveVar("");
  this.authorUrl = new ReactiveVar("");
  this.authorName = new ReactiveVar("Loading...");
  instance=Template.instance();
  Pub.getLast(function(index, result) {
    setInstanceCurrent(instance, index, result);
  });
});

Template.info.helpers({
  index() {
    return Template.instance().index.get();
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
  authorUrl() {
    return Template.instance().authorUrl.get();
  },
});


Template.info.events({
  'click button'(event, instance) {
    function setCurrent(index, result) {
        setInstanceCurrent(instance, index, result);
    }
    switch (event.target.id) {
    case 'rand':
        Pub.getRandom(setCurrent);
        break;
    case 'prev':
        index=instance.index.get() - 1;
        if (index < 0) {
            index=0;
        }
        Pub.get(index, setCurrent);
        break;
    case 'next':
        index=instance.index.get() + 1;
        size=Pub.size();
        if (index >= size) {
            Pub.fetchSize();
            index = size - 1;
        }
        Pub.get(index, setCurrent);
        break;
    }
  },
});
