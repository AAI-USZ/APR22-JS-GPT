'use strict';

describe('Meta Generator', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const metaGenerator = require('../../../lib/plugins/filter/after_render/meta_generator').bind(hexo);
const cheerio = require('cheerio');

it('default', () => {
const content = '<head><link></head>';
const result = metaGenerator(content);

const $ = cheerio.load(result);
$('meta[name="generator"]').should.to.have.lengthOf(1);
$('meta[name="generator"]').attr('content').should.eql(`Hexo ${hexo.version}`);
});

it('disable meta_generator', () => {
const content = '<head><link></head>';
hexo.config.meta_generator = false;
const result = metaGenerator(content);

should.not.exist(result);
});

it('no duplicate generator tag', () => {
hexo.config.meta_generator = true;
const result = str => metaGenerator(str);

should.not.exist(result('<head><link><meta name="generator" content="foo"></head>'));
should.not.exist(result('<head><link><meta content="foo" name="generator"></head>'));
});

it('ignore empty head tag', () => {
const content = '<head></head><head><link></head><head></head>';
hexo.config.meta_generator = true;
const result = metaGenerator(content);

const $ = cheerio.load(result);
$('meta[name="generator"]').should.to.have.lengthOf(1);

const expected = '<head></head><head><link><meta name="generator" content="Hexo '
+ hexo.version + '"></head><head></head>';
result.should.eql(expected);
});

it('apply to first non-empty head tag only', () => {
const content = '<head></head><head><link></head><head><link></head>';
hexo.config.meta_generator = true;
const result = metaGenerator(content);

const $ = cheerio.load(result);
$('meta[name="generator"]').should.to.have.lengthOf(1);

const expected = '<head></head><head><link><meta name="generator" content="Hexo '
+ hexo.version + '"></head><head><link></head>';
result.should.eql(expected);
});


it('multi-line head', () => {
const content = '<head>\n<link>\n</head>';
hexo.config.meta_generator = true;
const result = metaGenerator(content);

const $ = cheerio.load(result);
$('meta[name="generator"]').should.to.have.lengthOf(1);

const expected = '<head>\n<link>\n<meta name="generator" content="Hexo ' + hexo.version + '"></head>';

result.should.eql(expected);
});
});
