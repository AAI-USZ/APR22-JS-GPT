var path = require('path');
var rimraf = require('rimraf');
var Q = require('q');
var Project = require('../core/Project');
var createLink = require('../util/createLink');
var cli = require('../util/cli');
var defaultConfig = require('../config');

function link(logger, name, localName) {
if (name) {
return linkTo(logger, name, localName);
} else {
