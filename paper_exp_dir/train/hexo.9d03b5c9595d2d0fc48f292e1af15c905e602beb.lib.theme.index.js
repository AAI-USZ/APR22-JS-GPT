var pathFn = require('path');
var util = require('util');
var Box = require('../box');
var View = require('./view');
var i18n = require('hexo-i18n');
var _ = require('lodash');

function Theme(ctx){
Box.call(this, ctx, ctx.theme_dir);

this.config = {};

this.views = {};

this.processors = [
