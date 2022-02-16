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
