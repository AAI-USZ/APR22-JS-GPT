'use strict';

var util = require('hexo-util');
var Pattern = util.Pattern;
var _ = require('lodash');

function i18nLocalsFilter(locals) {
var i18n = this.theme.i18n;
var config = this.config;
var i18nDir = config.i18n_dir;
var page = locals.page;
var lang = page.lang || page.language;
var i18nLanguages = i18n.list();

if (!lang) {
var pattern = new Pattern(i18nDir + '/*path');
