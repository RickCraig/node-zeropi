'use strict';

var ZeroPiCore = require('./core');

class ZeroPi extends ZeroPiCore {
  constructor(options) {
    super(options);
  }

  digitalWrite(pin, level) {
    this.write(`M11 D${pin} L${level}`);
  }

  pwmWrite(pin, pwm) {
    this.write(`M11 D${pin} P${pwm}`);
  }

  digitalRead(pin, callback) {
    this.selectors[`R12 D${pin}`] = callback;
    this.write(`M12 D${pin}`);
  }

  analogRead(pin, callback) {
    this.selectors[`R13 A${pin}`] = callback;
    this.write(`M13 A${pin}`);
  }

  dcMotorRun(device, pwm) {
    this.write(`M21 D${device} P${pwm}`);
  }

  dcMotorStop(device) {
    this.write(`M22 D${device}`);
  }

  servoRun(device, angle) {
    this.write(`M41 D${device} A${angle}`);
  }

  stepperRun(device, speed) {
    this.write(`M51 D${device} F${speed}`);
  }

  stepperMove(device, distance, speed, callback) {
    this.selectors[`R52 D${device}`] = callback;
    this.write(`M52 D${device} R${distance} F${speed}`);
  }

  stepperMoveTo(device, position, speed, callback) {
    this.selectors[`R52 D${device}`] = callback;
    this.write(`M52 D${device} A${position} F${speed}`);
  }

  stepperStop(device) {
    this.write(`M54 D${device}`);
  }

  steppersEnable() {
    this.write('M56');
  }

  steppersDisable() {
    this.write('M57');
  }

  stepperSetting(device, microstep, acceleration) {
    this.write(`M53 D${device} S${microstep} A${acceleration}`);
  }
}

module.exports = ZeroPi;
