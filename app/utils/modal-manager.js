/* $Id$ */

import Ember from 'ember';
import ModalComponent from '../components/ui-modal';

export default Ember.Object.create({
  container: null,

  showBasicModal: function(model, props) {
    return this.show(null, props, model);
  },

  show: function(name, properties, model) {
    var self = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var dialog = new ModalComponent();
      dialog.setProperties($.extend({
        container: self.get('container'),

        model: model,

        contentTemplateName: name,

        approveClicked: function () {
          resolve(model, properties);
        },

        denyClicked: function () {
          reject(model, properties);
        }
      }, properties));

      dialog.append();
    });
  },

  alert: function(alertDetails, model) {
    alertDetails = alertDetails || {};
    alertDetails.isAlert = true;

    return this.showBasicModal(model, alertDetails);
  },

  confirm: function(confirmDetails, model) {
    confirmDetails = confirmDetails || {};
    confirmDetails.isAlert = false;

    return this.showBasicModal(model, confirmDetails);
  }
});
