const should = require('chai').should();
const util = require('hexo-util');
const _ = require('lodash');
const defaultConfig = require('../../../lib/hexo/default_config');

describe('Backtick code block', () => {
const Hexo = require('../../../lib/hexo');
const hexo = new Hexo();
const codeBlock = require('../../../lib/plugins/filter/before_post_render/backtick_code_block').bind(hexo);

const code = [
'if (tired && night){',
'  sleep();',
'}'
].join('\n');

function highlight(code, options) {
return util.highlight(code, options || {})
.replace(/{/g, '&#123;')
.replace(/}/g, '&#125;');
}

beforeEach(() => {

hexo.config.highlight = _.cloneDeep(defaultConfig.highlight);
});

it('disabled', () => {
const content = [
'``` js',
code,
'```'
].join('\n');

const data = {content};
