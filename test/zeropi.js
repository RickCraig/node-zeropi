'use strict';

const sinon = require('sinon'),
  Helpers = require('./helpers'),
  Core = require('../lib/core'),
  ZeroPi = require('../lib/zeropi'),
  should = require('chai').should();

describe('ZeroPi', () => {

  let sandbox;
  let helpers;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    helpers = new Helpers(sandbox);
  });

  afterEach(() => sandbox.restore());

  describe('Core', () => {

    context('constructor', () => {

      it('should set the options', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        core.options.should.equal(options);
      });

      it('should set debug to false by default', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        core.options.debug.should.equal(false);
      });

      it('should run open when the connection is open', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy(core, 'open');
        core.serialPort.emit('open');
        spy.called.should.be.true;
      });

    });

    context('open', () => {

      it('should set isOpen to true', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        core.open();
        core.isOpen.should.be.true;
      });

      it('should call the onOpen callback', () => {
        const options = { path: 'test/path' };
        const spy = sandbox.spy();
        const core = new Core(options);
        core.onOpen = spy;
        core.open();
        spy.called.should.be.true;
      });

      it('should run data', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const mock = sandbox.mock(core).expects('data');
        core.open();
        core.serialPort.emit('data');
        mock.verify();
      });

    });

    context('data', () => {

      it('should strip the response of all newlines', done => {
        const options = { path: 'test/path' };
        const core = new Core(options);

        sandbox.stub(core, 'getCallback', result => {
          result.should.equal('test OK');
          done();
        });

        const mock = { toString: () => '\r\ntest OK' };
        core.data(mock);
      });

      it('should call getCallback when "OK" is returned', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy(core, 'getCallback');
        const mock = { toString: () => '\r\ntest OK' };
        core.data(mock);
        spy.called.should.be.true;
      });

    });

    context('getCallback', () => {

      it('should call the correct callback when an outcome exists', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy();
        core.selectors['D00'] = spy;
        core.getCallback('D00 L0 OK');
        spy.called.should.be.true;
      });

      it('should call the correct callback when no outcome exists', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy();
        core.selectors['D00'] = spy;
        core.getCallback('D00');
        spy.called.should.be.true;
      });

      it('should return the correct outcome', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy();
        core.selectors['D00'] = spy;
        core.getCallback('D00 L1234 OK');
        spy.args[0][0].should.equal(1234);
      });

    });

    context('log', () => {

      it('should not log when debug is set to false', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy(console, 'log');
        core.log('test');
        spy.called.should.be.false;
      });

      it('should log when debug is set to true', () => {
        const options = { path: 'test/path', debug: true };
        const core = new Core(options);
        const spy = sandbox.spy(console, 'log');
        core.log('test');
        spy.called.should.be.true;
      });

    });

    context('onResult', () => {

      it('should console.log an error if an error is returned', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy(console, 'log');
        const error = new Error('test');
        core.onResult(error);
        spy.called.should.be.true;
        spy.args[0][1].should.equal(error);
      });

      it('should log the response if debug is set to true', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy(core, 'log');
        const error = new Error('test');
        core.onResult(null, 'result');
        spy.called.should.be.true;
      });

    });

    context('write', () => {

      it('should not send the message when the port is not open', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy(core.serialPort, 'write');
        core.write('test');
        spy.called.should.be.false;
      });

      it('should send the message when the port is open', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy(core.serialPort, 'write');
        core.isOpen = true;
        core.write('test');
        spy.called.should.be.true;
      });

      it('should call onResult when complete', () => {
        const options = { path: 'test/path' };
        const core = new Core(options);
        const spy = sandbox.spy(core, 'onResult');
        const stub = sandbox.stub(core.serialPort, 'write', (str, cb) => {
          cb(null, '');
        });
        core.isOpen = true;
        core.write('test');
        spy.called.should.be.true;
      });

    });

  });

  describe('Helpers', () => {

    const zeropi = new ZeroPi({ path: 'test/path' });

    context('digitalWrite', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.digitalWrite(10, 1);
        spy.args[0][0].should.equal('M11 D10 L1');
      });

    });

    context('pwmWrite', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.pwmWrite(10, 1);
        spy.args[0][0].should.equal('M11 D10 P1');
      });

    });

    context('digitalRead', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.digitalRead(10, () => {});
        spy.args[0][0].should.equal('M12 D10');
      });

      it('should call the callback on successful read', () => {
        const spy = sandbox.spy();
        zeropi.digitalRead(10, spy);
        zeropi.getCallback('R12 D10 L0 OK');
        spy.called.should.be.true;
        spy.args[0][0].should.equal(0);
      });

    });

    context('analogRead', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.analogRead(10, () => {});
        spy.args[0][0].should.equal('M13 A10');
      });

      it('should call the callback on successful read', () => {
        const spy = sandbox.spy();
        zeropi.analogRead(10, spy);
        zeropi.getCallback('R13 A10 L0 OK');
        spy.called.should.be.true;
        spy.args[0][0].should.equal(0);
      });

    });

    context('dcMotorRun', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.dcMotorRun(0, 1000);
        spy.args[0][0].should.equal('M21 D0 P1000');
      });

    });

    context('dcMotorStop', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.dcMotorStop(0);
        spy.args[0][0].should.equal('M22 D0');
      });

    });

    context('servoRun', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.servoRun(0, 90);
        spy.args[0][0].should.equal('M41 D0 A90');
      });

    });

    context('stepperRun', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.stepperRun(0, 1000);
        spy.args[0][0].should.equal('M51 D0 F1000');
      });

    });

    context('stepperMove', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.stepperMove(0, 1000, 1000, () => {});
        spy.args[0][0].should.equal('M52 D0 R1000 F1000');
      });

      it('should call the callback on success', () => {
        const spy = sandbox.spy();
        zeropi.stepperMove(0, 1000, 1000, spy);
        zeropi.getCallback('R52 D0 L0 OK');
        spy.called.should.be.true;
        spy.args[0][0].should.equal(0);
      });

    });

    context('stepperMoveTo', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.stepperMoveTo(0, 100, 1000, () => {});
        spy.args[0][0].should.equal('M52 D0 A100 F1000');
      });

      it('should call the callback on success', () => {
        const spy = sandbox.spy();
        zeropi.stepperMoveTo(0, 100, 1000, spy);
        zeropi.getCallback('R52 D0 L0 OK');
        spy.called.should.be.true;
        spy.args[0][0].should.equal(0);
      });

    });

    context('stepperStop', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.stepperStop(0);
        spy.args[0][0].should.equal('M54 D0');
      });

    });

    context('steppersEnable', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.steppersEnable(0);
        spy.args[0][0].should.equal('M56');
      });

    });

    context('steppersDisable', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.steppersDisable(0);
        spy.args[0][0].should.equal('M57');
      });

    });

    context('stepperSetting', () => {

      it('should write the correct message to "write"', () => {
        const spy = sandbox.spy(zeropi, 'write');
        zeropi.stepperSetting(0, 10, 1000);
        spy.args[0][0].should.equal('M53 D0 S10 A1000');
      });

    });

  });

});
