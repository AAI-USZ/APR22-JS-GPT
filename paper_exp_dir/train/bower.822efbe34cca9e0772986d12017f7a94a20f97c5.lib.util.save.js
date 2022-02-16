







var path   = require('path');
var fs     = require('fs');
var semver = require('semver');
var _      = require('lodash');

var config = require('../core/config');

function save(eventType, modifier, emitter, manager, paths) {

manager.on(eventType, manager.on('loadJSON', function () {

var pkgs = paths.map(function (curr) {
curr = curr.split('#')[0];
