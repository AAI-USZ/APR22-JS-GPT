'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var tildify = require('tildify');
var Transform = require('stream').Transform;
var PassThrough = require('stream').PassThrough;
var _ = require('lodash');
var util = require('hexo-util');

var join = pathFn.join;

function generateConsole(args) {
args = args || {};
var force = args.f || args.force;
var bail = args.b || args.bail;
