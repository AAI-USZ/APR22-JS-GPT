var pathFn = require('path'),
_ = require('lodash'),
async = require('async'),
Box = require('../box'),
i18n = require('../core/i18n');



var Theme = module.exports = function Theme(){
Box.call(this, hexo.theme_dir);


this.config = {};


this.i18n = new i18n(hexo.config.language);
