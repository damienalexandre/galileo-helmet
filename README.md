galileo-helmet
==============

Requirements
------------

- Galileo gen 2
- Wifi extension

Wire
----

- light sensor on A0
- 2 buzzer on D3 and D6 (important!)
- LED on D2
- temp buttons on D8 and D7
- transistor pin for turn signal LEDs: pin 12 and 11 (from arduino)

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
