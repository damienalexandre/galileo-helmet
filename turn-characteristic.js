
var util = require('util');

var bleno = require('bleno');
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function TurnCharacteristic() {
  TurnCharacteristic.super_.call(this, {
    uuid: '01010101010101010101010101524742',
    properties: ['write', 'writeWithoutResponse'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'set direction'
      })
    ]
  });
}

util.inherits(TurnCharacteristic, BlenoCharacteristic);

TurnCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  } else if (data.length !== 3) {
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
  } else {
    console.log('received', data);
  }
};

module.exports = TurnCharacteristic;