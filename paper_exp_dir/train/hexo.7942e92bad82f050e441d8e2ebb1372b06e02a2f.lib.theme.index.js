var Promise = require('bluebird');
var pathFn = require('path');
var _ = require('lodash');
var util = require('util');
var Box = require('../box');
var View = require('./view');
var chalk = require('chalk');
var prettyHrtime = require('pretty-hrtime');
var i18n = require('hexo-i18n');

function Theme(ctx){
Box.call(this, ctx, ctx.theme_dir);

this.config = {};

this.views = {};

this.i18n = new i18n({
