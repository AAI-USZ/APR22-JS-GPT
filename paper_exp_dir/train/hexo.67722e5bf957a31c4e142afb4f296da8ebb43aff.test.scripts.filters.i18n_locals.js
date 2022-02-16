var should = require('chai').should();

describe('i18n locals', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var i18nFilter = require('../../../lib/plugins/filter/template_locals/i18n').bind(hexo);
var theme = hexo.theme;
var i18n = theme.i18n;


hexo.config.language = 'en';
