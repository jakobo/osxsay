#!/usr/local/bin/bash
tempnam=`mktemp -d -t saymore`
cd $tempnam
npm install https://github.com/Jakobo/osxsay/tarball/master
cd $tempnam/node_modules/osxsay
node start.js &
clear