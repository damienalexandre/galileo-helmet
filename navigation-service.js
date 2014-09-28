var util = require('util');

var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;

var TurnCharacteristic = require('./turn-characteristic');

function NavigationService() {
  NavigationService.super_.call(this, {
    uuid: '01010101010101010101010101010101',
    characteristics: [
      new TurnCharacteristic(),
    ]
  });
}

util.inherits(NavigationService, BlenoPrimaryService);

module.exports = NavigationService;