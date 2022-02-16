var pathFn = require('path'),
_ = require('lodash'),
async = require('async'),
colors = require('colors'),
domain = require('domain'),
Box = require('../box'),
i18n = require('../core/i18n'),
HexoError = require('../error');



var Theme = module.exports = function Theme(){
Box.call(this, hexo.theme_dir);


this.config = {};
