'use strict';

var SerialPort = require('serialport').SerialPort;

class ZeroPiCore {
  constructor(options) {
    // Callback placeholders
    this.onOpen = () => {};

    // Serial port setup
    this.options = options || { debug: false };
    this.isOpen = false;
    this.selectors = {};
    this.serialPort = new SerialPort('/dev/ttyAMA0', { baudrate: 115200 });
    this.serialPort.on('open', () => this.open());

    this.serialPort.on('error', err => {
      console.log('An error has occurred with the serial port', err);
    });

    this.serialPort.on('disconnect', () => {
      this.log('Serial port disconnected');
    });
  }

  open() {
    this.isOpen = true;
    this.onOpen();
    this.log('Serial port opened successfully');
    this.serialPort.on('data', data => this.data(data));
  }

  data(data) {
    let buffer = String(data);
    this.log('Data Received: ', buffer);

    if (buffer.indexOf('\n') > -1) {
      buffer = buffer.replace(/\\n|\\r/g, '');

      if (buffer.length > 3 && buffer.indexOf('OK') > -1) {
        this.getCallback(buffer);
      }
    }
  }

  getCallback(buffer) {
    if (buffer.indexOf('L') > -1) {
      const split = buffer.split(' L');

      if (split[0]) {
        const result = Number(split[1].split(' OK')[0]);
        this.selectors[split[0]](result);
      }
    } else {
      const name = String(buffer.split(' OK')[0]);
      if (this.selectors[name]) selectors[name]();
    }
  }

  log(message) {
    if (!this.options.debug) return;
    console.log(message);
  }

  onResult(err, results) {
    if (err) return console.log('An error has occurred during writing', err);
    this.log(results);
  }

  write(str) {
    if (this.isOpen) {
      this.serialPort.write(`\n${str}\n`, (err, results) => {
        this.onResult(err, results);
      });
    }
  }
}

module.exports = ZeroPiCore;
