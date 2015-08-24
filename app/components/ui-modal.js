/* $Id$ */

import Ember from 'ember';
import layout from '../templates/components/ui-modal';
import {
  translationMacro as t
} from "ember-i18n";

export default Ember.Component.extend({
  i18n: Ember.inject.service(),

  ok: t('label.ok'),

  cancel: t('label.cancel'),

  layout: layout,

  content: null,

  isAlert: false,

  size: 'small',

  classNames: ['ui', 'modal', 'scrolling'],

  classNameBindings: ['size'],

  contentTemplateName: null,

  contentController: Ember.computed('contentTemplateName', {
    get: function() {
      var contentTemplateName = this.get('contentTemplateName');

      return this.get('container').lookup('controller:'+contentTemplateName);
    }
  }),

  didInsertElement: function () {
    var self = this;

    this._replaceFooter();

    this.$().modal({
      onHidden: function () {
        self.destroyElement();
      },

      onApprove: function () {
        self.sendAction('approveClicked');
      },

      onDeny: function () {
        self.sendAction('denyClicked');
      }
    }).modal('show');
  },

  _replaceFooter: function () {
    this.$('.custom-footer').append(this.$('.footer'));
  }
});
