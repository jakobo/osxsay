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
  '/index': fs.readFileSync('./templates/screen/index.html').toString()
};

for (name in tl) {
  tl[name] = {
    string: tl[name],
    fn: microtemplates(tl[name])
  };
}

var savers = {
  "Flying Windows": {
    path: path.resolve(__dirname, '..', 'extras', 'savers', 'Flying\ Windows'),
    name: 'Flying Windows'
  },
  "Kernel Panic": {
    path: path.resolve(__dirname, '..', 'extras', 'savers', 'KPSaver.saver'),
    name: 'KPSaver'
  }
};

function makeSetWallpaperCommand(paper) {
  var command = 'osascript -e \'tell application "Finder" to set desktop picture to POSIX file "{{PAPER}}"\'';
  command = command.replace(/\{\{PAPER\}\}/g, paper);
  return command;
}

function makeSleepCommand() {
  var command = 'osascript -e \'tell application "System Events" to sleep\'';
  return command;
}

function makeSaverCommand() {
  var command = 'open -a /System/Library/Frameworks/ScreenSaver.framework//Versions/A/Resources/ScreenSaverEngine.app';
  return command;
}

function makeSetSaverCommand(saver) {
  var command = ['defaults -currentHost write com.apple.screensaver',
                 'moduleDict -dict',
                   'moduleName "{{NAME}}"',
                   'path "{{SAVER}}"',
                  'type -int 0'].join(' ');
  command = command.replace(/\{\{SAVER\}\}/g, saver.path).replace(/\{\{NAME\}\}/g, saver.name);
  return command;
}

function makeBigMouseCommand() {
  var command = [
  'osascript -e \'',
  '  set cursorSize to 4',
  '  tell application "System Preferences" to activate',
  '  delay 1',
  '  tell application "System Events"',
  '    click menu item "Accessibility" of menu "View" of menu bar 1 of process "System Preferences"',
  '    delay 1',
  '    tell window "Accessibility" of process "System Preferences"',
  '      set value of slider 2 of group 1 to cursorSize',
  '    end tell',
  '  end tell',
  '  delay 1',
  '  tell application "System Preferences" to quit',
  '\''].join('\n');
  return command;
}

module.exports = function(app, base) {
  app.get(base, function(req, res) {
    var body = tl['/index'].fn({
      X: sanitizer.sanitize,
      header: require('../templates/shared/header'),
      footer: require('../templates/shared/footer'),
      savers: savers,
      urls: {
        paper: base + '/paper',
        sleep: base + '/sleep',
        setsaver: base + '#setsaver',
        screensaver: base + '/saver',
        bigmouse: base + '/bigmouse'
      }
    });
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
  });
  
  // app.post(base + '/paper', function(req, res) {
  //   var file = new tmp.File();
  //   var out = fs.createWriteStream(file.path);
  //   var rem = request(req.body.fileurl);
  //   rem.on('data', function(chunk) {
  //     out.write(chunk);
  //   });
  //   rem.on('end', function() {
  //     exec(makeSetWallpaperCommand(file.path), function(error, stdout, stderr) {
  //       var body = require('../templates/shared/redirect')(base);
  //       res.setHeader('Content-Type', 'text/html');
  //       res.setHeader('Content-Length', Buffer.byteLength(body));
  //       res.end(body);
  //     });
  //   });
  // });
  
  // app.post(base + '/sleep', function(req, res) {
  //   var body = require('../templates/shared/redirect')(base);
  //   res.setHeader('Content-Type', 'text/html');
  //   res.setHeader('Content-Length', Buffer.byteLength(body));
  //   res.end(body);
  //   exec(makeSleepCommand(), function(error, stdout, stderr) {
  //     // noop
  //   });
  // });
  
  // app.post(base + '/saver', function(req, res) {
  //   var body = require('../templates/shared/redirect')(base);
  //   res.setHeader('Content-Type', 'text/html');
  //   res.setHeader('Content-Length', Buffer.byteLength(body));
  //   res.end(body);
  //   exec(makeSaverCommand(), function(error, stdout, stderr) {
  //     // noop
  //   });
  // });
  
  // app.post(base + '/bigmouse', function(req, res) {
  //   var body = require('../templates/shared/redirect')(base);
  //   res.setHeader('Content-Type', 'text/html');
  //   res.setHeader('Content-Length', Buffer.byteLength(body));
  //   res.end(body);
  //   exec(makeBigMouseCommand(), function(error, stdout, stderr) {
  //     // noop
  //   });
  // });

  // app.post(base + '/setsaver', function(req, res) {
  //   var useSaver = savers[req.body.saver];
  //   
  //   if (useSaver) {
  //     console.log(makeSetSaverCommand(useSaver));
  //     console.log(base);
  //     exec(makeSetSaverCommand(useSaver), function(error, stdout, stderr) {
  //       var body = require('../templates/shared/redirect')(base);
  //       res.setHeader('Content-Type', 'text/html');
  //       res.setHeader('Content-Length', Buffer.byteLength(body));
  //       res.end(body);
  //     });
  //   }
  //   else {
  //     var body = require('../templates/shared/redirect')(base);
  //     res.setHeader('Content-Type', 'text/html');
  //     res.setHeader('Content-Length', Buffer.byteLength(body));
  //     res.end(body);
  //   }
  // });
};