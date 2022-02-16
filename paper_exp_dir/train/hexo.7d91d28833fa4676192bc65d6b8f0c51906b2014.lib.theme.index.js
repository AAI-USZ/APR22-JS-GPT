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


this.i18n = new i18n({
code: hexo.config.language
});


this.views = {};

this.processors = [
require('./processors/config'),
require('./processors/i18n'),
require('./processors/view'),
require('./processors/source')
];
};

Theme.prototype.__proto__ = Box.prototype;

Theme.prototype.load = Box.prototype.process;

Theme.prototype._generate = function(options, callback){
options = _.extend({
watch: false
}, options);

var model = hexo.model,
config = hexo.config,
route = hexo.route,
siteLocals = hexo.locals._generate(),
themeLocals = _.extend({}, config, this.config, config.theme_config),
env = hexo.env,
i18n = this.i18n,
layoutDir = pathFn.join(this.base, 'layout') + pathFn.sep,
self = this,
d = domain.create(),
called = false;

hexo._themeConfig = themeLocals;


var ensureLanguage = function(page, path) {
var lang = page.lang || '';


if (!lang) {

if (config.language) {
if (_.isArray(config.language)) {

