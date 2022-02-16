const should = require('chai').should();
const util = require('hexo-util');
const cheerio = require('cheerio');

describe('code', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const codeTag = require('../../../lib/plugins/tag/code')(hexo);
const escapeHTML = util.escapeHTML;

const fixture = [
'if (tired && night){',
'  sleep();',
'}'
].join('\n');

function code(args, content) {
return codeTag(args.split(' '), content);
}

function highlight(code, options) {
return util.highlight(code, options || {})
.replace(/{/g, '&#123;')
.replace(/}/g, '&#125;');
}

it('default', () => {
const result = code('', fixture);
result.should.eql(highlight(fixture));
});

it('non standard indent', () => {
const nonStandardIndent = [
