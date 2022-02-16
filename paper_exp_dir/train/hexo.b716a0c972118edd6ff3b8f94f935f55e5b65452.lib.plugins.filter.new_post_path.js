var pathFn = require('path');
var moment = require('moment');
var _ = require('lodash');
var Promise = require('bluebird');
var util = require('hexo-util');
var fs = require('hexo-fs');
var Permalink = util.Permalink;
var permalink;

var reservedKeys = {
year: true,
month: true,
i_month: true,
day: true,
i_day: true,
title: true
