var forever = require('forever-monitor');

var child = new (forever.Monitor)('server.js', {
  silent: true,
  max: 100,
  killTree: true,
  watch: true,
  watchIgnorePatterns: ['*.sh', '*.md', '*.js'], // only watch for the package.json for changes
  options: []
});

child.start();