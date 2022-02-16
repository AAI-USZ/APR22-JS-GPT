var path = require('path');
var rimraf = require('rimraf');
var mout = require('mout');
var Q = require('q');
var Logger = require('bower-logger');
var Project = require('../core/Project');
var createLink = require('../util/createLink');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function linkSelf(config) {
var project;
var logger = new Logger();

config = mout.object.deepFillIn(config || {}, defaultConfig);
project = new Project(config, logger);

project.getJson()
.then(function (json) {
var src = config.cwd;
var dst = path.join(config.storage.links, json.name);


return Q.nfcall(rimraf, dst)

.then(function () {
return createLink(src, dst);
})
.then(function () {
return {
src: src,
dst: dst
};
});
})
.done(function (result) {
logger.emit('end', result);
}, function (error) {
logger.emit('error', error);
});

return logger;
}
