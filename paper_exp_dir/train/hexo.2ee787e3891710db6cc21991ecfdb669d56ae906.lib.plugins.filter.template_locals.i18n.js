'use strict';

const util = require('hexo-util');
const Pattern = util.Pattern;
const _ = require('lodash');

function i18nLocalsFilter(locals) {
const i18n = this.theme.i18n;
const config = this.config;
const i18nDir = config.i18n_dir;
const page = locals.page;
let lang = page.lang || page.language;
const i18nLanguages = i18n.list();

if (!lang) {
const pattern = new Pattern(`${i18nDir}/*path`);
