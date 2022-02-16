var fs = require('fs')
var path = require('path')

var helper = require('./helper')
var log = require('./logger').create('plugin')

var IGNORED_PACKAGES = ['karma-cli', 'karma-runner.github.com']

exports.resolve = function (plugins) {
var modules = []

var requirePlugin = function (name) {
