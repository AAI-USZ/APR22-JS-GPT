var glob = require('glob');
var mm = require('minimatch');
var fs = require('fs');
var util = require('./util');
var log = require('./logger').create('watcher');


var createWinGlob = function(realGlob) {
return function(pattern, options, done) {
var drive = pattern.substr(0, 3);
options = util.merge(options, { cwd: drive });
realGlob(pattern.substr(3), options, function(err, results) {
done(err, results.map(function(path) {
return drive + path;
}));
});
};
};

if (process.platform === 'win32') {
glob = createWinGlob(glob);
