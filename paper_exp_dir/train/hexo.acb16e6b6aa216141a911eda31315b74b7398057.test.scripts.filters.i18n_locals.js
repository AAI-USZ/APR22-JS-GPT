const should = require('chai').should();

describe('i18n locals', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const i18nFilter = require('../../../lib/plugins/filter/template_locals/i18n').bind(hexo);
const theme = hexo.theme;
const i18n = theme.i18n;


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
Home: '首頁'
});

it('page.lang set', () => {
const locals = {
config: hexo.config,
page: {
lang: 'zh-tw'
}
};

i18nFilter(locals);

locals.__('Home').should.eql('首頁');
});

it('page.language set', () => {
const locals = {
config: hexo.config,
page: {
language: 'zh-tw'
}
};

i18nFilter(locals);

locals.__('Home').should.eql('首頁');
});

it('detect by path (lang found)', () => {
const locals = {
config: hexo.config,
page: {},
path: 'zh-tw/index.html'
};

i18nFilter(locals);

locals.page.lang.should.eql('zh-tw');
locals.page.canonical_path.should.eql('index.html');
locals.__('Home').should.eql('首頁');
});

it('detect by path (lang not found)', () => {
const locals = {
