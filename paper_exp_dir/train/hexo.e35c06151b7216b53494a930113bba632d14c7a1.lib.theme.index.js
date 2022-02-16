var pathFn = require('path'),
_ = require('lodash'),
async = require('async'),
Box = require('../box'),
i18n = require('../core/i18n');



var Theme = module.exports = function Theme(){
Box.call(this, hexo.theme_dir);


this.config = {};


this.i18n = new i18n({
code: hexo.config.language
});


this.views = {};

this.processors = [
require('./processors/config'),
require('./processors/i18n'),
require('./processors/view'),
