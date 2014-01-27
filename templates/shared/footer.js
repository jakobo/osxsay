var fs = require('fs');
var path = require('path');
var microtemplates = require('microtemplates');
var template = microtemplates(fs.readFileSync(path.resolve(__dirname, 'footer.html')).toString());
var pjson = require('../../package.json');

module.exports = template({
  version: pjson.version,
  urls: {
    update: '/update'
  }
});