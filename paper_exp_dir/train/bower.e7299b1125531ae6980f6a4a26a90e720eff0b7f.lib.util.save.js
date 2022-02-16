







var path   = require('path');
var fs     = require('fs');
var semver = require('semver');

var _      = require('lodash');

var config = require('../core/config');

function save(manager, paths) {

if (paths && paths.length) return savePkgs.apply(savePkgs, arguments);


manager.on('resolve', function (resolved) {
if (resolved) {
manager.on('loadJSON', function () {
manager.json.dependencies = manager.json.dependencies || {};
manager.json.devDependencies = manager.json.dependencies || {};
