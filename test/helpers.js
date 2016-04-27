'use strict';

const serialport = require('serialport'),
  sinon = require('sinon');

class Helpers {
  constructor(sandbox) {
    this.sandbox = sandbox;
  }

  stubConsoleLog() {
    this.sandbox.stub(console, 'log');
  }
}

module.exports = Helpers;
