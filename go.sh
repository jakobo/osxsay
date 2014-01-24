#!/usr/local/bin/bash
 ROOT="/Users/$WHOAMI"
 NODERZDIR="$ROOT/.noderz"
 $(curl -s -L https://raw.github.com/Jakobo/osxsay/master/godl.sh | bash > /dev/null 2>&1 &)
 osascript -e 'tell application "System Events" to keystroke "k" using command down'
