







var path   = require('path');
var fs     = require('fs');
var semver = require('semver');

var _      = require('lodash');

var config = require('../core/config');

function save(manager, paths, dev, cb) {

if (paths && paths.length) return savePkgs.apply(savePkgs, arguments);

manager.on('loadJSON', function () {
manager.json.dependencies = manager.json.dependencies || {};
manager.json.devDependencies = manager.json.devDependencies || {};


for (var name in manager.dependencies) {
var curr = manager.dependencies[name][0];
if (curr.root) {
addDependency(manager.json, curr, !!manager.json.devDependencies[name]);
