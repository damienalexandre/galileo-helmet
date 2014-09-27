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

// Tilt socket
var tiltSocket = new net.Socket({ fd: null
  allowHalfOpen: false,
  readable: false,
  writable: false
});

// Test buttons to remove later
var testButton = new mraa.Gpio(7);
testButton.dir(mraa.DIR_IN);

var testButton2 = new mraa.Gpio(8);
testButton2.dir(mraa.DIR_IN);

mainLoop(); //called periodicaly

console.log("Welcome to super helmet");

function mainLoop()
{
    var isPressed1 =  testButton.read();
    if (isPressed1) {
        pleaseTurnSignal(buzzerLeft);
    }
    
    var isPressed2 =  testButton2.read();
    if (isPressed2) {
        pleaseTurnSignal(buzzerRight);
    }
    
    if (lightSensor.read() < 1000) {
        lights.write(1);
    } else {
        lights.write(0);
    }
    
    setTimeout(mainLoop, 100);
}

function pleaseTurnSignal(buzzer)
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
