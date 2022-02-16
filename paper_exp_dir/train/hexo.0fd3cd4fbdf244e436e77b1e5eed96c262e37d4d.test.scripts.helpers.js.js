'use strict';

const cheerio = require('cheerio');

describe('js', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo(__dirname);

const ctx = {
config: hexo.config
};

ctx.url_for = require('../../../lib/plugins/helper/url_for').bind(ctx);

const js = require('../../../lib/plugins/helper/js').bind(ctx);

function assertResult(result, expected) {
const $ = cheerio.load(result);

if (!Array.isArray(expected)) {
expected = [expected];
}

expected.forEach((item, index) => {
if (typeof item === 'string' || item instanceof String) {
$('script').eq(index).attr('src').should.eql(item);
} else {
for (const attribute in item) {
if (item[attribute] === true) {
$('script').eq(index).attr(attribute).should.eql(attribute);
} else {
$('script').eq(index).attr(attribute).should.eql(item[attribute]);
}
}
}
});
}

it('a string', () => {
assertResult(js('script'), '/script.js');
assertResult(js('script.js'), '/script.js');
assertResult(js('https://hexo.io/script.js'), 'https://hexo.io/script.js');
assertResult(js('//hexo.io/script.js'), '//hexo.io/script.js');
});

it('an array', () => {
assertResult(js(['//hexo.io/script.js']), '//hexo.io/script.js');

assertResult(js(['foo', 'bar', 'baz']), ['/foo.js', '/bar.js', '/baz.js']);
});

it('multiple strings', () => {
assertResult(js('foo', 'bar', 'baz'), ['/foo.js', '/bar.js', '/baz.js']);
});

it('multiple arrays', () => {
