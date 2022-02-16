'use strict';

const util = require('hexo-util');
const cheerio = require('cheerio');

describe('code', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const codeTag = require('../../../lib/plugins/tag/code')(hexo);
const { escapeHTML } = util;

const fixture = [
'if (tired && night){',
'  sleep();',
'}'
].join('\n');

function code(args, content) {
return codeTag(args.split(' '), content);
}


function enablePrismjs() {
hexo.config.highlight.enable = false;
hexo.config.prismjs.enable = true;
}

function highlight(code, options) {
return util.highlight(code, options || {})
.replace(/{/g, '&#123;')
.replace(/}/g, '&#125;');
}
