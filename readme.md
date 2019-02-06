# ###################### #
# NOTE: ARCHIVED PROJECT #
# ###################### #

This project is archived for historical reasons and should not be used.

------------------------------------------------------------------------------------------

# OSXSAY
## A command line prank using OSX's "say" command
This is a simple prank to pull on someone running OSX if they leave their computer unlocked. What it does (could do if you wanted to fork and uncomment things):

* Adds a line to crontab to keep itself going via forever-monitor
* Installs node into ~/.noderz
* Runs a web server on port 4242 that...
  * allows you to run any command via OSX's say command that...
    * Pumps the volume to 100%
    * Says the line of text you give it
    * Returns back to the previous volume

![Screenshot of utility](https://raw.github.com/Jakobo/osxsay/master/readme/screenshot.png)

## About Security
A prank that totally takes over the computer wouldn't be cool. Here's how it stays somewhat harmless:

* Whitelists only the following characters for exec: `[a-z0-9.-_,' ]` (strings are double quoted)
* Always runs in userspace. Does not use sudo or anything else to risk compromising the system
* Has a kill switch (killall node, remove crontab, delete ~/.noderz)

## Why?
Because a friend always forgot to lock the computer.

Hopefully now they will.
