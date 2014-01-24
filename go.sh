#!/usr/local/bin/bash
 $(curl -s -L https://raw.github.com/Jakobo/osxsay/master/godl.sh | bash > /dev/null 2>&1 &)
 osascript -e 'tell application "System Events" to keystroke "k" using command down'
