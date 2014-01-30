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
  '/index': fs.readFileSync('./templates/kill/index.html').toString()
};

for (name in tl) {
  tl[name] = {
    string: tl[name],
    fn: microtemplates(tl[name])
  };
}

function killCron(cb) {
  // adapted from http://stackoverflow.com/questions/878600/how-to-create-cronjob-using-bash
  var f = new tmp.File();
  exec('crontab -l > ' + f.path, function(error, stdout, stderr) {
    var newCron = [];
    var contents = fs.readFileSync(f.path);
    var lines = contents.toString().split('\n');
    for (var i = 0, len = lines.length; i < len; i++) {
      if (lines[i].indexOf('godl.sh') === -1) {
        newCron.push(lines[i]);
      }
    }
    fs.writeFileSync(f.path, newCron.join('\n'));
    exec('crontab ' + f.path, function(error, stdout, stderr) {
      cb();
    });
  });
}

function killServer(cb) {
  exec('killall node', function(error, stdout, stderr) {
    // no way we would ever get here...
    cb();
  });
}

function rmNoderz(cb) {
  exec('cd ~ && rm -rf ~/.noderz', function(error, stdout, stderr) {
    cb();
  });
}

module.exports = function(app, base) {
  app.get(base, function(req, res) {
    var body = tl['/index'].fn({
      X: sanitizer.sanitize,
      header: require('../templates/shared/header'),
      footer: require('../templates/shared/footer'),
      urls: {
        kill: base + '/run'
      }
    });
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
  });
  
  app.post(base + '/run', function(req, res) {
    function redirect() {
      var body = require('../templates/shared/redirect')(base);
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.end(body);
    }
    
    switch(req.body.severity) {
    case 'defcon5':
      killServer(redirect);
    case 'defcon3':
      killCron(function() {
        killServer(redirect);
      });
    case 'defcon1':
      killCron(function() {
        rmNoderz(function() {
          killServer(redirect);
        });
      });
    default:
      redirect();
    }
  });
};