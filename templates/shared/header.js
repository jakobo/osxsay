var fs = require('fs');
var path = require('path');
var microtemplates = require('microtemplates');
var template = microtemplates(fs.readFileSync(path.resolve(__dirname, 'header.html')).toString());

module.exports = template();