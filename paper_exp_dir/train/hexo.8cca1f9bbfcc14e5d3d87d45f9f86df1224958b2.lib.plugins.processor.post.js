'use strict';

var common = require('./common');
var Promise = require('bluebird');
var yfm = require('hexo-front-matter');
var pathFn = require('path');
var fs = require('hexo-fs');
var _ = require('lodash');
var util = require('hexo-util');
var slugize = util.slugize;
var Pattern = util.Pattern;
var Permalink = util.Permalink;

var postDir = '_posts/';
var draftDir = '_drafts/';
var permalink;

