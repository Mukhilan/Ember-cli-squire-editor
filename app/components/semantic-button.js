/* $Id$ */

import Ember from 'ember';
import layout from '../templates/components/semantic-button';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'button',

  classNames: ['ui', 'button'],

  classNameBindings: ['type'],

  type: 'basic',

  icon: null,

  clickedParam: null,

  clicked: null,

  attributeBindings: ['title', 'disabled'],

  click: function (event) {
    event.stopPropagation();
    this.sendAction('clicked', this.get('clickedParam'), event);
  }
});
