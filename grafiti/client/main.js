import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

function setInstanceCurrent(instance, index, result) {
    instance.index.set(index);
    instance.title.set(result[1]);
    instance.content.set(result[2]);
}

Template.info.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.title = new ReactiveVar("Loading...");
  this.index = new ReactiveVar(0);
  this.content = new ReactiveVar("Loading...");
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
  }
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
