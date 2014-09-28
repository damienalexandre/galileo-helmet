Happy Cycler
============

Intel Galileo powered bike helmet, done in 2 days at [IoT Roadshow](https://www.hackerleague.org/hackathons/intel-r-iot-roadshow-paris/hacks/happy-cycler).

Requirements
------------

- Galileo gen 2
- Wifi extension

Wire
----

- light sensor on A0
- 2 buzzer on D3 and D6 (important, PWM!)
- LED on D2
- temp buttons on D8 and D7
- transistor pin for turn signal LEDs: pin 12 and 11 (from arduino)
- 2 touch sensors on D4 and D5

Setup
-----

Setup the board (default system).

Edit `/etc/connman/main.conf` with the following:

    [General]
    PersistentTetheringMode = true

Then:

    connmanctl
    connmanctl> tether wifi on Helmet 12345678
    connmanctl> disable wifi
    connmanctl> enable wifi

The wifi network "Helmet" is now available.

Check you have opkg install libmraa0:

    opkg install libmraa0

Pics
----

[Front light](http://i.imgur.com/4b453gb.jpg) / [Turn signal](http://i.imgur.com/tmOEowx) / [The inside](http://i.imgur.com/BcM5ayB.jpg)