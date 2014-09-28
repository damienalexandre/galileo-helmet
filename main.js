var mraa = require('mraa'); //require mraa
var net = require('net');

console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console

// Buzzers
var buzzerLeft = new mraa.Pwm(3, -1, false);
buzzerLeft.period_us(2000);
buzzerLeft.enable(true);

var buzzerRight = new mraa.Pwm(6, -1, false);
buzzerRight.period_us(2000);
buzzerRight.enable(true);

// Lights!
var lights = new mraa.Gpio(2); // @todo switch to a relay
lights.dir(mraa.DIR_OUT);

// Light sensor
var lightSensor = new mraa.Aio(0);

// Turn signals
var turnSignalLeft = new mraa.Gpio(12);
turnSignalLeft.dir(mraa.DIR_OUT);

var turnSignalRight = new mraa.Gpio(11);
turnSignalRight.dir(mraa.DIR_OUT);

var currentSignal = null;
var turnSignalInterval = null;

// Test buttons to remove later
var testButton = new mraa.Gpio(7);
testButton.dir(mraa.DIR_IN);

var testButton2 = new mraa.Gpio(8);
testButton2.dir(mraa.DIR_IN);

var touchButtonRight = new mraa.Gpio(4);
touchButtonRight.dir(mraa.DIR_IN);

var touchButtonLeft = new mraa.Gpio(5);
touchButtonLeft.dir(mraa.DIR_IN);

var isRightTouchPressed = 0;
var isLeftTouchPressed = 0;


// I2C stuff
var wire = new Wire(/*device*/'/dev/i2c-1', /*address*/32);

wire.read(/*register*/0x00, function(err, value) {
    if (err) throw err;
    console.log('Read value', value);
});
wire.write(/*register*/0x00, /*value*/0xFF, function(err) {
    if (err) throw err;
});


mainLoop(); //called periodicaly

console.log("Welcome to super helmet");

function mainLoop()
{
    var isPressed1 =  testButton.read();
    if (isPressed1) {
        pleaseTurnDuuuuude(buzzerLeft);
    }
    
    var isPressed2 =  testButton2.read();
    if (isPressed2) {
        pleaseTurnDuuuuude(buzzerRight);
    }
    
    if (lightSensor.read() < 1000) {
        console.log('Start light');
        lights.write(1);
    } else {
        lights.write(0);
    }
    
    displayTurnSignal(currentSignal);
    
    var touchPressedRight = touchButtonRight.read();
    if(touchPressedRight && !isRightTouchPressed) {
		if(currentSignal == null || currentSignal == turnSignalRight) {
			currentSignal = turnSignalRight;
		} else {
			currentSignal = null;
		}
	}
    isRightTouchPressed = touchPressedRight;
    
    var touchPressedLeft = touchButtonLeft.read();
    if(touchPressedLeft && !isLeftTouchPressed) {
        if(currentSignal == null || currentSignal == turnSignalLeft) {
			currentSignal = turnSignalLeft;
		} else {
			currentSignal = null;
		}
    }
    isLeftTouchPressed = touchPressedLeft;
    
    
    setTimeout(mainLoop, 100);
}

function pleaseTurnDuuuuude(buzzer)
{
    console.log('Start sound');
    buzzer.write(0.8);
    
    setTimeout(function() {
        buzzer.write(0.2);

        setTimeout(function() {
            buzzer.write(0.4);

            setTimeout(function() {
                buzzer.write(0.6);

                setTimeout(function() {
                    buzzer.write(0);
                }, 50);
            }, 50);
        }, 60);
    }, 50);
}

function displayTurnSignal()
{
    
    
    if (turnSignalInterval) {
        // already running, exit
        return;
    }
    
    var isLighted = true;
    turnSignalInterval = setInterval(function() {
        if (!currentSignal) {
        if (turnSignalInterval) {
            clearInterval(turnSignalInterval);
            turnSignalInterval = null;
        }
        turnSignalLeft.write(0);
        turnSignalRight.write(0);
        return;
    }
        // Sound
        buzzerRight.write(isLighted ? 0.2 : 0.4);
        setTimeout(function() {
            buzzerRight.write(0);
        }, 5);
        
        // Light :)
        currentSignal.write(isLighted ? 1 : 0);
        isLighted = !isLighted;
    }, 600);
}

console.log("\n\n\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$\"&nbsp;&nbsp;&nbsp;*.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d$$$$$$$P\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;&nbsp;J\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^$.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4r&nbsp;&nbsp;\"\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d\"b&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.db\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;P&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;e\"&nbsp;$\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;..ec..&nbsp;.\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;zP&nbsp;&nbsp;&nbsp;$.zec..\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.^&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3*b.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.P\"&nbsp;.@\"4F&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"4\n&nbsp;&nbsp;&nbsp;.\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d\"&nbsp;&nbsp;^b.&nbsp;&nbsp;&nbsp;&nbsp;*c&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.$\"&nbsp;&nbsp;d\"&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%\n&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;P&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$.&nbsp;&nbsp;&nbsp;&nbsp;\"c&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d\"&nbsp;&nbsp;&nbsp;@&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3r&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3\n&nbsp;4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.eE........$r===e$$$$eeP&nbsp;&nbsp;&nbsp;&nbsp;J&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*..&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b\n&nbsp;$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$$$$$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;4$$$$$$$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;F&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;d$$$.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4\n&nbsp;$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$$$$$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;4$$$$$$$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;L&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*$$$\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4\n&nbsp;4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"\"3P&nbsp;===$$$$$$\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;P\n&nbsp;&nbsp;*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"\"\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;J\n&nbsp;&nbsp;&nbsp;\".&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.P&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;@\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;z*\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^%.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.r\"\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\"*==*\"\"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^\"*==*\"\"&nbsp;&nbsp;&nbsp;Gilo94'\n\n");


var bleno = require('bleno');

var NavigationService = require('./navigation-service');
var navigationService = new NavigationService();

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising('Helmet', [navigationService.uuid]);
  } else {
    // bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  
  if (!error) {
    bleno.setServices([navigationService]);
  }
});
