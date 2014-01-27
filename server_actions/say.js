var path = require('path');
var exec = require('child_process').exec;
var sanitizer = require('sanitizer');
var microtemplates = require('microtemplates');
var fs = require('fs');

// templates used in this file, read sync on startup
var tl = {
  '/index': fs.readFileSync('./templates/say/index.html').toString()
};

for (name in tl) {
  tl[name] = {
    string: tl[name],
    fn: microtemplates(tl[name])
  };
}

module.exports = function(app, base) {

  var said = [];
  var queue = [];
  
  function makeNotifyCommand(title, subtitle, message) {
    var command = './bin/terminal-notifier.app/Contents/MacOS/terminal-notifier -title "{TITLE}" -subtitle "{{SUBTITLE}}" -message "{{MESSAGE}}"';
  
    title = title.replace(/[^a-z0-9.-_,' ]/gi, '');
    subtitle = subtitle.replace(/[^a-z0-9.-_,' ]/gi, '');
    message = message.replace(/[^a-z0-9.-_,' ]/gi, '');
  
    command = command.replace(/\{\{TITLE\}\}/g, title)
                     .replace(/\{\{SUBTITLE\}\}/g, subtitle)
                     .replace(/\{\{MESSAGE\}\}/g, message);
  
    return command;
  }

  function makeSayCommand(volume, lastVolume, voice, message) {
    volume = volume.replace(/[^0-9]/gi, '');
    lastVolume = lastVolume.replace(/[^0-9]/gi, '');
    voice = voice.replace(/[^a-z0-9.-_,' ]/gi, '');
    message = message.replace(/[^a-z0-9.-_,' ]/gi, '');

    var command = [makeVolumeCommand(volume),
                   'say -v "{{VOICE}}" "{{MESSAGE}}"',
                   makeVolumeCommand(lastVolume)].join(' && ');

    command = command.replace(/\{\{VOICE\}\}/g, voice)
                     .replace(/\{\{MESSAGE\}\}/g, message);
                   
    return command;
  }

  function makeVolumeCommand(volume) {
    volume = volume.replace(/[^0-9]/gi, '');
    var command = 'osascript -e \'set volume output volume {{VOLUME}}\'';
    command = command.replace(/\{\{VOLUME\}\}/g, volume);
    return command;
  }

  function makeGetVolumeCommand() {
    return 'osascript -e \'output volume of (get volume settings)\'';
  }

  function sayLoop() {
    if (queue.length > 0) {
      var next = queue.shift();
      said.unshift(next)
    
      if (said.length > 20) {
        said = said.slice(0, 20);
      }
    
      // get the system volume
      exec(makeGetVolumeCommand(), function(error, stdout, stderr) {
        var lastVolume = stdout;
      
        if (parseInt(lastVolume) <= 0 || parseInt(next.volume) <= 0) {
          // use notification center
          command = makeNotifyCommand('HEY', 'New message from ' + next.voice, next.message);
        }
        else {
          command = makeSayCommand(next.volume, lastVolume, next.voice, next.message);
        }

        // perform the message
        exec(command, function(error, stdout, stderr) {
          // and do it again!
          setImmediate(sayLoop);
        });      
      })
    }
    else {
      // and again
      setImmediate(sayLoop);
    }
  }
  sayLoop();

  app.get(base, function(req, res) {
    var body = tl['/index'].fn({
      X: sanitizer.sanitize,
      header: require('../templates/shared/header'),
      footer: require('../templates/shared/footer'),
      urls: {
        send: base + '/send'
      },
      logs: {
        pending: queue,
        past: said
      },
      lastVoice: req.query.voice || '',
      lastVolume: req.query.volume || ''
    });
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
  });
  
  app.post(base + '/send', function(req, res) {
    // too long of a queue resets
    if (queue.length > 20) {
      queue = [];
    }
  
    if (!req.body.voice || !req.body.message) {
      res.redirect(base + '/?voice=' + req.body.voice + '&volume=' + req.body.volume);
      return;
    }

    queue.push({
      voice: req.body.voice,
      message: req.body.message,
      volume: req.body.volume
    });
  
    // back to main
    res.redirect(base + '/?voice=' + req.body.voice + '&volume=' + req.body.volume);
  });
};