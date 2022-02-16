var should = require('chai').should();

describe('i18n locals', () => {
var Hexo = require('../../../lib/hexo');
var hexo = new Hexo();
var i18nFilter = require('../../../lib/plugins/filter/template_locals/i18n').bind(hexo);
var theme = hexo.theme;
var i18n = theme.i18n;


i18n.languages = ['en', 'default'];


i18n.set('de', {
Home: 'Zuhause'
});

i18n.set('default', {
Home: 'Default Home'
});

i18n.set('en', {
Home: 'Home'
});

i18n.set('zh-tw', {
