galileo-helmet
==============

Requirements
------------

- Galileo gen 2
- Wifi extension

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
