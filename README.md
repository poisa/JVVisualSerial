# JVVisualSerial
### A javascript class for visual serial communications (with other hardware)

Version 1.0 Created by [Julian Vidal](http://julianvidal.com/)

## What does it do?

Basically it blinks a couple of HTML elements so that you can communicate (one way) serially to another device. There is one element that sends clock data and another one that sends the actual binary data.

I'm using this to send messages to an Arduino project that has a couple of sensors installed. By pointing it to the computer monitor and aligning the device's clock and data sensors to the blinking divs I'm able to program (and re-program) my project without having to connect it to USB.
I got the idea from makershed's BlinkyPov.

## Installation

You only need jQuery and `jvvisualserial.js` (the other files in the example are just cosmetics and are not used by the class).

## Usage

```javascript
$(document).ready(function(){
	// instanciate a new JVVisualSerial object and pass it
	//   1) CSS class that points to your clock element (typically a DIV)
	//   2) CSS class that points to your data element (typically a DIV)
	//	 3) The milliseconds to wait between each clock tick (how fast the communication goes). Note that
			your hardware will determine how fast you can go with this. 100 is a good starting point.
	//   4) Your binary data
    serial = new JVVisualSerial('serial_clock', 'serial_data', blinkDelay, '100001110');
    serial.beginTransmition();
});

## Examples

You will find a fully working example in the `examples` directory.

## Other methods

All the things you set in the constructor can be set at a later time (as well as returned using the included getters):

`setClockClass(clockClass)`, `getClockClass()`, `setDataClass(dataClass)`, `getDataClass()`, `setBlinkDelay(blinkDelay)`, `getBlinkDelay()`, `setBinaryData(binaryData)`, `getBinaryData()`

There is also a helper method that will return the percentage of the current transmit process:

`getPercentDone()`

## Callbacks

The class supports a few callbacks that notify you of certain events

`serial.beginTransmition(onTickCallback, onEndTransmitionCallback);`

`onTickCallback` fires on each clock tick. Note that the clock runs as TWICE the speed that you set in the constructor. 
`onEndTransmitionCallback` fires after all the bits have been transmitted.

`serial.beginCalibration(onEndCalibrationCallBack);`

`onEndCalibrationCallBack` fires after the calibration has finished.

## What is the calibration for?

It just blinks both elements a few times to give your hardware a chance to know how bright and how dark your computer monitor is. For more info, please read the README on the [Calibrator](https://github.com/poisa/Calibrator) repository which is a Calibration library for Arduino.


## License

JVVisualSerial is released under the Apache 2.0 license. See the included LICENSE file.

## VERSION HISTORY

2013-07-19 First version
