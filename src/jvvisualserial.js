/*
 Copyright 2013 Julian Fernando Vidal | https://github.com/poisa/JVVisualSerial
 Version 1.0

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 *
 * @param string clockClass
 * @param string dataClass
 * @param int    blinkDelay
 * @param string binaryData
 */
function JVVisualSerial(clockClass, dataClass, blinkDelay, binaryData)
{
    this.clockClass = clockClass;
    this.dataClass  = dataClass;
    this.blinkDelay = blinkDelay;
    this.binaryData = binaryData;

    this.$serial_clock = $("." + clockClass);
    this.$serial_data  = $("." + dataClass);

    this.onEndTransmitionCallback = null;
    this.onTickCallback           = null;
    this.percentDone              = 0;
};


///////////////////////////////////////////////////////////////
// Public methods

JVVisualSerial.prototype.beginCalibration = function(onEndCalibrationCallBack)
{
    this.resetEnvironment();

    var calibrateTimes = 0;
    self = this;
    calibrationInterval = setInterval(function() {
        self.toggleClock();
        self.setNextDataBit(self.clockTicks % 2);
        if (calibrateTimes === 10) {
            self.setNextDataBit(0);
            self.setState(self.$serial_clock, false);
            if (typeof onEndCalibrationCallBack === 'function') {
                onEndCalibrationCallBack();
            }
            clearInterval(calibrationInterval);

        }
        calibrateTimes++;
    }, 100);
};

JVVisualSerial.prototype.beginTransmition = function(onTickCallback, onEndTransmitionCallback)
{
    this.onTickCallback = onTickCallback;

    this.onEndTransmitionCallback = onEndTransmitionCallback;
    this.resetEnvironment();

    this.dataLength = this.binaryData.length;

    self = this;
    this.clockInterval = setInterval(function() {
        self.loop();
    }, this.blinkDelay / 2);
};


JVVisualSerial.prototype.stopTransmition = function()
{
    clearInterval(this.clockInterval);
    this.$serial_clock.css('background-color', 'black');
};

JVVisualSerial.prototype.setClockClass = function(clockClass)
{
    this.clockClass = clockClass;
};

JVVisualSerial.prototype.getClockClass = function()
{
    return this.clockClass;
};

JVVisualSerial.prototype.setDataClass = function(dataClass)
{
    this.dataClass = dataClass;
};

JVVisualSerial.prototype.getDataClass = function()
{
    return this.dataClass;
};

JVVisualSerial.prototype.setBlinkDelay = function(blinkDelay)
{
    this.blinkDelay = blinkDelay;
};

JVVisualSerial.prototype.getBlinkDelay = function()
{
    return this.blinkDelay;
};

JVVisualSerial.prototype.setBinaryData = function(binaryData)
{
    this.binaryData = binaryData;
};

JVVisualSerial.prototype.getBinaryData = function()
{
    return this.binaryData;
};

JVVisualSerial.prototype.getPercentDone = function()
{
    return this.percentDone;
};


///////////////////////////////////////////////////////////////
// Private methods

JVVisualSerial.prototype.loop = function()
{
    this.percentDone = Math.floor(this.dataIndex / this.dataLength * 100);

    if (this.needToToggleClock) {
        this.toggleClock();
        this.needToToggleClock = false;
    } else {
        this.setNextDataBit(this.binaryData[this.dataIndex]);
        this.dataIndex++;
        this.needToToggleClock = true;
    }

    if (typeof this.onTickCallback === 'function') {
        this.onTickCallback();
    }

    if (this.dataIndex === this.dataLength && !this.needToToggleClock) {
        this.stopTransmition();
        if (typeof this.onEndTransmitionCallback === 'function') {
            this.onEndTransmitionCallback();
        }
    }
};

JVVisualSerial.prototype.resetEnvironment = function()
{
    this.setState(this.$serial_clock, false);
    this.setState(this.$serial_data, false);

    this.dataIndex  = 0;        // What bit we are transmitting
    this.dataLength = 0;        // this.binaryData.lenght (cached since we need to call this many times)
    this.clockTicks = -1;
    this.needToToggleClock = false;
    this.clockInterval = 0;     // Used to hold the setInterval
};

JVVisualSerial.prototype.toggleClock = function()
{
    this.clockTicks++;

    if (this.clockTicks % 2 === 1) {
        this.setState(this.$serial_clock, false);
    } else {
        this.setState(this.$serial_clock, true);
    }
};

JVVisualSerial.prototype.setNextDataBit = function(bit)
{
    if (parseInt(bit) === 0) {
        this.setState(this.$serial_data, false);
    } else {
        this.setState(this.$serial_data, true);
    }
};

JVVisualSerial.prototype.setState = function(selector, state)
{
    var color = 'black';

    if (state) {
        color = 'white';
    }

    selector.css('background-color', color);
};



