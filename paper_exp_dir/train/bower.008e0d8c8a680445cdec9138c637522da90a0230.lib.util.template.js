







var events = require('events');
var hogan  = require('hogan.js');
var path   = require('path');
var fs     = require('fs');

var colors = require('../util/hogan-colors');

var templates = {};
var printColors = true;

module.exports = function (name, context, sync) {
var emitter = new events.EventEmitter;

var templateName = name + '.mustache';
var templatePath = path.join(__dirname, '../../templates/', templateName);

var renderFunc = printColors ? 'renderWithColors' : 'renderWithoutColors';

