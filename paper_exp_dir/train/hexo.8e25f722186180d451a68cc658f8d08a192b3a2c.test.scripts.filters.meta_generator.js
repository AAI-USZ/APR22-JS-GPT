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

should.equal(result, undefined);
});

it('no duplicate generator tag', () => {
hexo.config.meta_generator = true;
const result = str => metaGenerator(str);

should.equal(result('<head><link><meta name="generator" content="foo"></head>'), undefined);
should.equal(result('<head><link><meta content="foo" name="generator"></head>'), undefined);
});
