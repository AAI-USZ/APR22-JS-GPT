var stringify = require('./stringify');
var constant = require('./constants');
var util = require('./util');



var Karma = function(socket, context, navigator, location) {
var hasError = false;
var startEmitted = false;
var store = {};
var self = this;
var browserId = (location.search.match(/\?id=(.*)/) || [])[1] || util.generateId('manual-');

