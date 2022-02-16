

var path = require('path');
var util = require('util');
var urlparse = require('url').parse;

var common = require('./common');

var VERSION = require('../constants').VERSION;
var SCRIPT_TAG = '<script type="%s" src="%s"></script>';
var LINK_TAG_CSS = '<link type="text/css" href="%s" rel="stylesheet">';
var LINK_TAG_HTML = '<link href="%s" rel="import">';
var SCRIPT_TYPE = {
'.js': 'text/javascript',
