







var events = require('events');
var nopt   = require('nopt');
var _      = require('lodash');

var template  = require('../util/template');
var config    = require('../core/config');

module.exports = function (name) {
var context      = {};
var emitter      = new events.EventEmitter;
var commands     = require('../commands');
var templateName = name ? 'help-' + name : 'help';
