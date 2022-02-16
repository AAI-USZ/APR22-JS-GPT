var path = require('path');
var rimraf = require('../util/rimraf');
var Q = require('q');
var Project = require('../core/Project');
var createLink = require('../util/createLink');
var defaultConfig = require('../config');
var relativeToBaseDir = require('../util/relativeToBaseDir');

function link(logger, name, localName, config) {
if (name) {
return linkTo(logger, name, localName, config);
} else {
return linkSelf(logger, config);
}
}

function linkSelf(logger, config) {
var project;

config = defaultConfig(config);
project = new Project(config, logger);

return project.getJson().then(function(json) {
var src = config.cwd;
var dst = path.join(config.storage.links, json.name);


return (
Q.nfcall(rimraf, dst)

.then(function() {
return createLink(src, dst);
})
.then(function() {
return {
src: src,
dst: dst
};
})
);
