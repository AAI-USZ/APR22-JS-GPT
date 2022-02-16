var Promise = require('bluebird');
var pathFn = require('path');
var _ = require('lodash');
var util = require('../util');
var Box = require('../box');
var View = require('./view');

require('colors');

function Theme(ctx){
Box.call(this, ctx, ctx.theme_dir);

this.config = {};

this.views = {};

this.processors = [
require('./processors/config'),
require('./processors/view'),
require('./processors/source')
