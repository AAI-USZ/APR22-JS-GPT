'use strict';

var _ = require('lodash');
var os = require('os');

function versionConsole(args){

var versions = _.extend({
hexo: this.version,
os: os.type() + ' ' + os.release() + ' ' + os.platform() + ' ' + os.arch()
