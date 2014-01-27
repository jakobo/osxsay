var express = require('express');
var path = require('path');
var exec = require('child_process').exec;
var sanitizer = require('sanitizer');
var microtemplates = require('microtemplates');
var fs = require('fs');
var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use("/stylesheets", express.static(__dirname + '/stylesheets'));
app.use("/images", express.static(__dirname + '/images'));

require('./server_actions/say')(app, '/say');

// templates used in this file, read sync on startup
var tl = {
  '/update': fs.readFileSync('./templates/update.html').toString(),
  '/index': fs.readFileSync('./templates/index.html').toString()
};

for (name in tl) {
  tl[name] = {
    string: tl[name],
    fn: microtemplates(tl[name])
  };
}

app.get('/', function(req, res) {
  var body = tl['/index'].fn();
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

app.get('/update', function(req, res) {
  // from current directory, go up one level
  // run npm update from the command line
  var basedir = path.resolve(__dirname, '..');
  var thisNode = process.execPath;
  var thisNpm = path.resolve(path.dirname(thisNode), 'npm');
  var command = 'cd ' + basedir + ' && ' + thisNpm + ' install https://github.com/Jakobo/osxsay/tarball/master';
  
  exec(command, function(error, stdout, stderr) {
    // just exit. forever (start.js) will restart us
    var body = tl['/update'].fn();
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
    process.exit(0);
  });
});

app.listen(4242);