# OSXSAY
## A command line prank using OSX's "say" command
This is a simple prank to pull on someone running OSX if they leave their computer unlocked. What it does:

* Installs node into ~/.noderz
* Adds a line to redownload itself to the bash_profile so it can somewhat survive a restart within the constraints of userspace
* Runs a web server on port 4242 that...
  * allows you to run any command via OSX's say command that...
    * Pumps the volume to 100%
    * Says the line of text you give it
    * Returns back to the previous volume

![Screenshot of utility](https://raw.github.com/Jakobo/osxsay/master/readme/screenshot.png)

## About Security
A prank that totally takes over the computer wouldn't be cool. Here's how it stays somewhat harmless:

* Removable via a one line bash_profile change
* Whitelists only the following characters for exec: `[a-z0-9.-_,' ]` (strings are double quoted)
* Always runs in userspace. Does not use sudo or anything else to risk compromising the system

## Why?
Because a friend always forgot to lock the computer.

Hopefully now they will.
