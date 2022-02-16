var pathFn = require('path');
var moment = require('moment');
var _ = require('lodash');
var Promise = require('bluebird');
var util = require('../../util');
var fs = util.fs;
var escape = util.escape;
var Permalink = util.permalink;
var permalink;

var reservedKeys = {
year: true,
month: true,
