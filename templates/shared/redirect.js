var fs = require('fs');
var path = require('path');
var microtemplates = require('microtemplates');
var template = microtemplates(fs.readFileSync(path.resolve(__dirname, 'redirect.html')).toString());

module.exports = function(returnUrl) {
  template({
    header: require('./header'),
    footer: require('./footer'),
    urls: {
      home: returnUrl
    }
  });
};