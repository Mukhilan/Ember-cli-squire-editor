/* $Id$ */

import ModalManager from "../utils/modal-manager";

export function initialize(container, app) {
  ModalManager.reopen({
    container: app.__container__
  });
}

export default {
  name: 'modal',
  initialize: initialize
};
