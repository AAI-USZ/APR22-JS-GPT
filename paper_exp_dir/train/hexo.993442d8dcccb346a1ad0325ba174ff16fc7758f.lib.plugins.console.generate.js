'use strict';

var fs = require('hexo-fs');
var pathFn = require('path');
var Promise = require('bluebird');
var prettyHrtime = require('pretty-hrtime');
var chalk = require('chalk');
var _ = require('lodash');
var inherits = require('util').inherits;
var crypto = require('crypto');
var Stream = require('stream');
var Transform = Stream.Transform;

function generateConsole(args){

var route = this.route;
var publicDir = this.public_dir;
var log = this.log;
