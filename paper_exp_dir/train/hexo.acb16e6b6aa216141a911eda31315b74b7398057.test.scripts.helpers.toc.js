const should = require('chai').should();
const _ = require('lodash');

function ifTrue(cond, yes, no) {
return cond ? yes : no;
}

describe('toc', () => {
const toc = require('../../../lib/plugins/helper/toc');

const html = [
'<h1 id="title_1">Title 1</h1>',
'<h2 id="title_1_1">Title 1.1</h2>',
'<h3 id="title_1_1_1">Title 1.1.1</h3>',
'<h2 id="title_1_2">Title 1.2</h2>',
'<h2 id="title_1_3">Title 1.3</h2>',
'<h3 id="title_1_3_1">Title 1.3.1</h3>',
'<h1 id="title_2">Title 2</h1>',
'<h2 id="title_2_1">Title 2.1</h2>',
'<h1 id="title_3">Title should escape &amp;, &lt;, &#39;, and &quot;</h1>',
'<h1 id="title_4"><a name="chapter1">Chapter 1 should be printed to toc</a></h1>'
].join('');

const genResult = options => {
options = _.assign({
class: 'toc',
list_number: true,
max_depth: 6
}, options);

const className = options.class;
const listNumber = options.list_number;
const maxDepth = options.max_depth;

const resultTitle_1_1_1 = [
'<ol class="' + className + '-child">',
'<li class="' + className + '-item ' + className + '-level-3">',
'<a class="' + className + '-link" href="#title_1_1_1">',
ifTrue(listNumber, '<span class="' + className + '-number">1.1.1.</span> ', ''),
'<span class="' + className + '-text">Title 1.1.1</span>',
'</a>',
'</li>',
'</ol>'
].join('');

const resultTitle_1_3_1 = [
