'use strict';

const { Pattern } = require('hexo-util');
const _ = require('lodash');

function i18nLocalsFilter(locals) {
const { i18n } = this.theme;
const { config } = this;
const i18nDir = config.i18n_dir;
const { page } = locals;
let lang = page.lang || page.language;
const i18nLanguages = i18n.list();
