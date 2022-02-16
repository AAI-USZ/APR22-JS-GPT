var moment = require('moment');
var swig = require('swig');
var Promise = require('bluebird');
var pathFn = require('path');
var _ = require('lodash');
var yaml = require('js-yaml');
var util = require('hexo-util');
var fs = require('hexo-fs');
var yfm = require('hexo-front-matter');

var escape = util.escape;

var rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
var rSwigVar = /\{\{[\s\S]*?\}\}/g;
var rSwigComment = /\{#[\s\S]*?#\}/g;
var rSwigBlock = /\{%[\s\S]*?%\}/g;
var rSwigFullBlock = /\{% *(.*?) *%\}[\s\S]+?\{% *end\1 *%\}/g;
var placeholder = '\uFFFC';
var rPlaceholder = /(?:<p>)?\uFFFC(\d+)(?:<\/p>)?/g;

var preservedKeys = {
title: true,
