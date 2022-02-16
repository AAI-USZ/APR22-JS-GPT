var stringify = require('./stringify');
var constant = require('./constants');
var util = require('./util');



var Karma = function(socket, iframe, opener, navigator, location) {
var hasError = false;
var startEmitted = false;
var reloadingContext = false;
var store = {};
var self = this;
var queryParams = util.parseQueryParams(location.search);
var browserId = queryParams.id || util.generateId('manual-');
var returnUrl = queryParams['return_url' + ''] || null;

var resultsBufferLimit = 50;
var resultsBuffer = [];

this.VERSION = constant.VERSION;
this.config = {};



this.socket = socket;

var childWindow = null;
var navigateContextTo = function(url) {
if (self.config.useIframe === false) {
if (childWindow === null || childWindow.closed === true) {

childWindow = opener('about:blank');
