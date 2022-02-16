







var path   = require('path');
var fs     = require('fs');
var semver = require('semver');

var config = require('../core/config');

function save(manager) {

manager.on('resolve', function () {
manager.on('loadJSON', function () {
manager.json.dependencies = manager.json.dependencies || {};


