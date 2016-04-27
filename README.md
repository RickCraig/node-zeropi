# ZeroPi node module for RaspberryPi

[![Build Status](https://travis-ci.org/RickCraig/node-zeropi.svg?branch=master)](https://travis-ci.org/RickCraig/node-zeropi)

I took it upon myself to rewrite the original node module developed by the [creators](http://www.makeblock.cc/) of [ZeroPi](https://www.kickstarter.com/projects/1204283/zeropi-arduino-and-raspberry-pi-compatible-develop), which can be found [here](https://github.com/ZeroPiProject/NodeForZeroPi).

The function names are the same, and so are the arguments passed to them. I just felt like the original code needed 'a bit of work'.

## Prerequisites

### Hardware

You will need the following:

- A Raspberry Pi (I have tested it on a RPi 2)
- A ZeroPi
- A Power Supply (To run motor(s), I scavenged a 12v 1A DC PSU off an old Linksys router)
- A Power Supply (To run the RPi)

The rest is up to you, I bought a Nema 23 Stepper motor and a stepper motor driver online to start me off.

### Software

You will need the following:

- An operating system on your RPi (I used Raspbian Jessie)
- Node v5+

## Hardware Setup

I will include the process I went through to get it all working, as I had a lot of trial and error. Hopefully it will
help someone out in the same situation.

### Setting up the Raspberry Pi

I followed the steps shown [here](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)

### Configuring the Raspberry Pi

When you first log in you will need to stop Raspbian using the serial ports, so they are free for you to use.

- In the terminal: `sudo raspi-config`
- Select 'Advanced Options'
- Select 'Serial'
- Select 'No'

You will need to restart for the settings to take effect. Once rebooted you will have full control over the serial ports.

### Configuring the ZeroPI

The ZeroPi requires firmware to be uploaded to it via the Arduino IDE. I had to do this bit on windows, because I couldn't get the board connected on Mac OSX (El Capitan).

#### Configuring Arduino IDE

Follow the steps shown [here](https://github.com/ZeroPiProject/ZeroPi_package)

#### Uploading the firmware

Follow the steps shown [here](https://github.com/ZeroPiProject/ZeroPi_Firmware)

### Connecting it all up

Once you have completed the setup of the Raspberry Pi and the ZeroPi has it's firmware uploaded, you can connect them together.

### Setting up the Node Environment

If you have your own way of setting up node feel free to do it your way. I did the following:

1. In terminal: `sudo apt-get install npm`
2. Once npm is installed get 'n' which is a node version manager: `sudo npm install n -g`
3. Once 'n' is installed get the latest version of node: `n latest`

This should download and install the latest version of node. To check: `node --version` (as of today that will be 6.0.0)

## Setting up a node app with the ZeroPi node module

This will detail the setup of your application. If you know how to do this already, skip to [Basic Usage](#Basic-Usage).

- Create a folder for your app in a location of your choice: `mkdir MyApp`
- Enter the directory: `cd MyApp`
- Initialise npm in the app: `npm init`
- Fill in all the details to suit (or hit enter until finished to get a basic setup)
- Create an index.js (or whatever you want to name it)

## Basic Usage

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();

zeropi.onOpen(() => {
  // The serial port has been opened successfully
  // We can do the business in here
  zeropi.stepperRun(0, 1000);
});
```

**Note: you must always call the main methods after the serial port has been opened. Doing it before will have no effect**

## How Devices/Pins Work

Devices work differently based on what you are targeting:

### DC motor

- 0 = Slot 1 (1A+, 1A-)
- 1 = Slot 2 (1B+, 1B-)
- 2 = Slot 3 (2A+, 2A-)
- 3 = Slot 4 (2B+, 2B-)
- and so on...

### Stepper motor

- 0 = Slot 1 (1A+, 1A-, 1B+, 1B-)
- 1 = Slot 2 (2A+, 2A-, 2B+, 2B-)
- 2 = Slot 3 (3A+, 3A-, 3B+, 3B-)
- 3 = Slot 4 (4A+, 4A-, 4B+, 4B-)

### Servos

- 0 = A0
- 1 = A1
- 2 = A2
- 3 = A3
- 4 = MO
- 5 = MI
- 6 = SCK
- 7 = SDA
- 8 = SCL

## Methods

The methods mirror the original module exactly. I will list them here for convenience.

#### digitalWrite

_digitalWrite(pin, level)_

- Pin: number (I don't know what the range is at the moment...)
- Level: number

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Turn the blue LED off
  zeropi.digitalWrite(13, 0);

  // Turn it back on after 5 seconds
  setTimeout(() => zeropi.digitalWrite(13, 1), 5000);
});
```

#### pwmWrite

_pwmWrite(pin, pwm)_

See [here](https://www.arduino.cc/en/Tutorial/PWM) for an explanation of PWM
- Pin: number (I don't know what the range is at the moment...)
- PWM: -255 - 255

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Use pwm to flash the led
  zeropi.digitalWrite(13, 64);
});
```

#### digitalRead

_digitalRead(pin, callback)_

- Pin: number (I don't know what the range is at the moment...)
- Callback: function

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Get the level of pin 13
  zeropi.digitalRead(13, level => {
    console.log('Read: ', level);
  });
});
```

#### analogRead

_analogRead(pin, callback)_

- Pin: number (I don't know what the range is at the moment...)
- Callback: function

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Get the level of pin 1
  zeropi.analogRead(1, level => {
    console.log('Read: ', level);
  });
});
```

#### dcMotorRun

_dcMotorRun(device, pwm)_

See [here](https://www.arduino.cc/en/Tutorial/PWM) for an explanation of PWM
- Device: see [How Devices/Pins Work](#How-Devices/Pins-Work)
- PWM: -255 - 255

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Run the motor on slot 1 at 25% Duty Cycle
  zeropi.dcMotorRun(0, 64);
});
```

#### dcMotorStop

_dcMotorStop(device)_

- Device: see [How Devices/Pins Work](#How-Devices/Pins-Work)

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Stop DC motor in slot 1
  zeropi.dcMotorStop(0);
});
```

#### stepperRun

_stepperRun(device, speed)_

- Device: see [How Devices/Pins Work](#How-Devices/Pins-Work)
- Speed: 0 - 20000

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Run stepper motor continuosly on slot 1 at speed 1000
  zeropi.stepperRun(0, 1000);
});
```

#### stepperMove

_stepperMove(device, distance, speed, callback)_

- Device: see [How Devices/Pins Work](#How-Devices/Pins-Work)
- Distance: Any number (both positive and negative)
- Speed: 0 - 20000
- Callback: function

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Move stepper motor in slot 1 1000 steps at speed 1000
  zeropi.stepperMove(0, 1000, 1000, () => {
    console.log('Stepper motor move complete');
  });
});
```

#### stepperMoveTo

_stepperMoveTo(device, position, speed, callback)_

- Device: see [How Devices/Pins Work](#How-Devices/Pins-Work)
- Position: Any number (both positive and negative)
- Speed: 0 - 20000
- Callback: function

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Move stepper motor in slot 1 to position 1000 steps at speed 1000
  zeropi.stepperMoveTo(0, 1000, 1000, () => {
    console.log('Stepper motor move to complete');
  });
});
```

#### stepperStop

_stepperStop(device)_

- Device: see [How Devices/Pins Work](#How-Devices/Pins-Work)

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Stop stepper motor in slot 1
  zeropi.stepperStop(0);
});
```

#### steppersEnable

_steppersEnable()_

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Enable all stepper motors
  zeropi.steppersEnable();
});
```

#### steppersDisable

_steppersDisable()_

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Disable all stepper motors
  zeropi.steppersDisable();
});
```

#### stepperSetting

_stepperSetting(device, microstep, acceleration)_

- Device: see [How Devices/Pins Work](#How-Devices/Pins-Work)
- Microstep: 1, 2, 4, 8, 16
- Acceleration: 0 - 20000

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Set settings for stepper motor in slot 1
  zeropi.stepperSetting(0, 2, 1000);
});
```

#### servoRun

_servoRun(device, angle)_

- Device: see [How Devices/Pins Work](#How-Devices/Pins-Work)
- Angle: 0 - 180

```javascript
const ZeroPi = require('zeropi');

const zeropi = new ZeroPi();
zeropi.onOpen(() => {
  // Move servo on pins A0 to 90 degrees
  zeropi.servoRun(0, 90);
});
```

## Contribution and Collaboration

At a stretch I am a beginner when it comes to electronics, I am a software developer by trade. Most of my information has been gleaned via Google searches... So I welcome feedback.

If you want to make a contribution to improve any aspect of this node module please feel free to put up a pull request. I will try to keep the module as up to date as possible.
