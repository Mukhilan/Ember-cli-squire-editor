import Ember from 'ember';
import ModalManager from '../utils/modal-manager';

export default Ember.Component.extend({
  editor: null,

  value: "",

  editorLinkValue:"",

  maxLength: 0,

  count: 0,

  textContent: "",

  willInsertElement: function() {
    this._createRichTextEditor();
    this._super();
  },

  _initRichTextEditor: function() {
    var value = this.get("value"),
      editor =  this.get("editor"),
      document = editor.getDocument();

    this._initEditorKeyListeners(document);
    this._initFontSizeDropDown(editor);

    if(value != null && value.length) {
      editor.setHTML(value);
      this._doUpdate();
    }

    editor.focus();
  },

  _createRichTextEditor: function() {
    var editor = null,
      rootElement = this.$(),
      iframe = document.createElement('iframe'),
      self = this;

    iframe.addEventListener( 'load', function () {
      var doc = iframe.contentDocument;
      if (doc.compatMode !== 'CSS1Compat') {
        doc.open();
        doc.write('<!DOCTYPE html><title></title>');
        doc.close();
      }

      editor = new Squire(doc);

      // load editor css file
      self._loadRichTextEditorStyle(doc);
      //iframe.style.border =

      self.set("editor", editor);
      self._initRichTextEditor();
    });

    rootElement.append(iframe);
  },

  _loadRichTextEditorStyle: function(document) {
    var link = document.createElement('link'),
        headElement = document.head;

    link.rel   = 'stylesheet';
    link.type = 'text/css';
    link.href = '../assets/editor.css';

    $(headElement).append(link);
  },

  _initEditorKeyListeners: function(document) {
    var self = this;

    this.$(document)
      .on("keypress", function() {
        self._doUpdate();
      })
      .on("click", function() {
        self._doUpdate();
      })
      .on("keyup", function() {
        self._doUpdate();
      })
      .on("keydown",function(event) {
        self._handleKeyBoardEvents(event);
      });
  },

  onMaxLengthReaches: function() {
      if(this.get("maxLength") < this.get("count")) {
        // have to implement max-length error throw
      }
  }.observes("count"),

  _handleKeyBoardEvents: function(event) {
    var isCtrlKey = event.ctrlKey,
        isCmdKey = event.metaKey,
        fontStyle = String.fromCharCode(event.which),
        self = this;

    this._handleFontStyleButtonStates(true);

    if(isCtrlKey || isCmdKey) {
      switch(fontStyle) {
        case "B" : {
          self.send("boldAction", true);
          break;
        }
        case "I" : {
          self.send("italicAction", true);
          break;
        }
        case "U" : {
          self.send("underlineAction", true);
          break;
        }
      }
    }
  },

  _initFontSizeDropDown: function(editor) {
    var self = this;

    this.$('.ui.dropdown.font-size')
      .dropdown({
        onChange: function(value) {
          if(value) {
            editor.setFontSize(value);
            self._doUpdate();
          }
        }
      });
  },

  _resetFontSizeDropdown: function() {
    this.$('.ui.dropdown.font-size')
      .dropdown('restore defaults');
  },

  _doUpdate: function() {
    var editor = this.get("editor");
    var editorContent = editor.getHTML(),
        textContent = $("<p>").html(editorContent).text();

    this.set("value", editorContent);
    this.set("textContent", textContent);
    this.set("count", textContent.trim().length);
  },

  getButtonState: function(format, validation, isKeyBoardEvent) {
    var editor = this.get("editor"),
        path = editor.getPath(),
        buttonState =  !(validation.test(path) | editor.hasFormat(format));

    if(isKeyBoardEvent) {
      return !buttonState;
    }

    return buttonState;
  },

  getButtonElement: function(buttonClass) {
      return this.$("button." + buttonClass);
  },

  _toggleButtonClass: function(buttonState, buttonClass) {
      var buttonElement = this.getButtonElement(buttonClass);

    if(buttonState) {
      buttonElement.addClass("active");
    } else {
      buttonElement.removeClass("active");
    }
  },

  _resetExistingAlignmentClass: function(selectedAlignmentClass) {
    var existingAlignmentElements = this.$("button.align:not(." + selectedAlignmentClass + ")");

    if(existingAlignmentElements) {
      existingAlignmentElements.removeClass("active");
    }
  },

  _handleFontStyleButtonStates: function(isKeyBoardEvent) {
    this.getButtonState('B', (/>B\b/), isKeyBoardEvent) ? this._toggleButtonClass(true, "bold") : this._toggleButtonClass(false, "bold") ;
    this.getButtonState('I', (/>I\b/), isKeyBoardEvent) ? this._toggleButtonClass(true, "italic") : this._toggleButtonClass(false, "italic") ;
    this.getButtonState('U', (/>U\b/), isKeyBoardEvent) ? this._toggleButtonClass(true, "underline") : this._toggleButtonClass(false, "underline");
  },

  onTextCount: function() {
    if(this.get("count") === 0) {
      this._resetFontStyleButtonStates();
    }
  }.observes("count"),

  _resetFontStyleButtonStates: function() {
    this._toggleButtonClass(false, "bold");
    this._toggleButtonClass(false, "italic");
    this._toggleButtonClass(false, "underline");
    this._resetFontSizeDropdown();
  },

  actions: {
    boldAction: function(isKeyBoardEvent) {
      var editor = this.get("editor"),
          buttonState = this.getButtonState('B', (/>B\b/), isKeyBoardEvent);

      if(buttonState) {
        editor.bold();
      } else {
        editor.removeBold();
      }

      this._toggleButtonClass(buttonState, "bold");
      this._doUpdate();
      editor.focus();
    },

    italicAction: function(isKeyBoardEvent) {
      var editor = this.get("editor"),
        buttonState = this.getButtonState('I',  (/>I\b/), isKeyBoardEvent);

      if(buttonState) {
        editor.italic();
      } else {
        editor.removeItalic();
      }

      this._toggleButtonClass(buttonState, "italic");
      this._doUpdate();
      editor.focus();
    },

    underlineAction: function(isKeyBoardEvent) {
      var editor = this.get("editor"),
        buttonState = this.getButtonState('U',  (/>U\b/), isKeyBoardEvent);

      if(buttonState) {
        editor.underline();
      } else {
        editor.removeUnderline();
      }

      this._toggleButtonClass(buttonState, "underline");
      this._doUpdate();
      editor.focus();
    },

    makeOrderedListAction: function() {
      var editor = this.get("editor"),
        buttonState = this.getButtonState('OL', (/>OL\b/));

      if(buttonState) {
        editor.makeOrderedList();
      } else {
        editor.removeList();
      }

      this._doUpdate();
      editor.focus();
    },

    makeUnorderedListAction: function() {
      var editor = this.get("editor"),
        buttonState = this.getButtonState('UL', (/>UL\b/));

      if(buttonState) {
        editor.makeUnorderedList();
      } else {
        editor.removeList();
      }

      this._doUpdate();
      editor.focus();
    },

    linkAction: function() {
      var self = this,
          editor = this.get("editor"),
          linkProtocol = 'http://',
          editorValue= null;

      ModalManager.show('rich-text-editor-link-modal', {
        title: "Insert Link",
        ok: "Insert Link"
      }).then(function(){
        editorValue = self.get("editorLinkValue");

        if (editorValue != null && editorValue.length ) {
          if (editorValue.substr(0, linkProtocol.length) !== linkProtocol) {
            editorValue = linkProtocol + editorValue;
          }

          editor.makeLink(editorValue);
          self._doUpdate();
        }
      });
    },

    EditorAlignmentAction: function(direction) {
      var editor = this.get("editor"),
          selectedAlignmentClass = "align-"+ direction;

      editor.setTextAlignment(direction);

      this._toggleButtonClass(true, selectedAlignmentClass);
      this._resetExistingAlignmentClass(selectedAlignmentClass);
      this._doUpdate();
    },

    unlinkAction: function() {
      var editor = this.get("editor"),
          selectedText = editor.getSelectedText();

      if(selectedText.length) {
        editor.removeLink();
        this._doUpdate();
      }
    }
  }
});
