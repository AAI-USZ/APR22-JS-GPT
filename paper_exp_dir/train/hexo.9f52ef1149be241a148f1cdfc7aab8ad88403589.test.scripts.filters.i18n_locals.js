'use strict';

describe('i18n locals', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const i18nFilter = require('../../../lib/plugins/filter/template_locals/i18n').bind(hexo);
const theme = hexo.theme;
const i18n = theme.i18n;


i18n.languages = ['en', 'default'];


