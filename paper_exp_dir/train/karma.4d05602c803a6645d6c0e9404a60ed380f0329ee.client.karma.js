var stringify = require('./stringify');
var constant = require('./constants');
var util = require('./util');



var Karma = function(socket, context, navigator, location) {
var hasError = false;
var startEmitted = false;
var store = {};
var self = this;
var queryParams = util.parseQueryParams(location.search);
var browserId = queryParams.id || util.generateId('manual-');
var returnUrl = queryParams.return_url || null;
var currentTransport;

var resultsBufferLimit = 1;
var resultsBuffer = [];

this.VERSION = constant.VERSION;
this.config = {};

this.setupContext = function(contextWindow) {
if (hasError) {
