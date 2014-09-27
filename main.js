var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the Intel XDK console


// Buzzers
var buzzerLeft = new mraa.Pwm(3, -1, false);
buzzerLeft.period_us(2000);
buzzerLeft.enable(true);

var buzzerRight = new mraa.Pwm(6, -1, false);
buzzerRight.period_us(2000);
buzzerRight.enable(true);

// Test buttons
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
    
    setTimeout(mainLoop, 100);
}

function pleaseTurnSignal(buzzer)
{
    console.log('Start sound');
    buzzer.write(1);
    
    setTimeout(function() {
        buzzer.write(0);

        setTimeout(function() {
            buzzer.write(0.4);

            setTimeout(function() {
                buzzer.write(1);

                setTimeout(function() {
                    buzzer.write(0);
                }, 100);
            }, 50);
        }, 100);
    }, 20);
}