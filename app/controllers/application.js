import Ember from 'ember';

export default Ember.Controller.extend({
  needs: "rich-text-editor-link-modal",

  richTextLinkController: Em.computed.alias('controllers.rich-text-editor-link-modal'),

  onRichTextLink: function() {
    var editorLinkValue = this.get("richTextLinkController.linkValue");

    this.set("editorLinkValue", editorLinkValue);
  }.observes("richTextLinkController.linkValue")
});
