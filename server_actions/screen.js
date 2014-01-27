var path = require('path');
var exec = require('child_process').exec;
var sanitizer = require('sanitizer');
var microtemplates = require('microtemplates');
var fs = require('fs');
var http = require('http');
var request = require('request');
var exec = require('child_process').exec;
var tmp = require('temporary');

// templates used in this file, read sync on startup
var tl = {
  '/index': fs.readFileSync('templates/screen/index.html').toString()
};

for (name in tl) {
  tl[name] = {
    string: tl[name],
    fn: microtemplates(tl[name])
  };
}

function makeSetWallpaperCommand(paper) {
  var command = 'osascript -e \'tell application "Finder" to set desktop picture to POSIX file "{{PAPER}}"\'';
  command = command.replace(/\{\{PAPER\}\}/g, paper);
  return command;
}

function makeSleepCommand() {
  var command = 'osascript -e \'tell application "System Events" to sleep\'';
  return command;
}

module.exports = function(app, base) {
  app.get(base, function(req, res) {
    var body = tl['/index'].fn({
      X: sanitizer.sanitize,
      header: require('../templates/shared/header'),
      footer: require('../templates/shared/footer'),
      urls: {
        paper: base + '/paper',
        sleep: base + '/sleep',
        screensaver: '#'
      }
    });
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
  });
  
  app.post(base + '/paper', function(req, res) {
    var file = new tmp.File();
    var out = fs.createWriteStream(file.path);
    var rem = request(req.body.fileurl);
    rem.on('data', function(chunk) {
      out.write(chunk);
      res.write(chunk);
    });
    rem.on('end', function() {
      exec(makeSetWallpaperCommand(file.path), function(error, stdout, stderr) {
        res.end();
      });
    });
  });
  
  app.post(base + '/sleep', function(req, res) {
    var body = require('../templates/shared/redirect');
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
    exec(makeSleepCommand(), function(error, stdout, stderr) {
      // noop
    })
  });
};