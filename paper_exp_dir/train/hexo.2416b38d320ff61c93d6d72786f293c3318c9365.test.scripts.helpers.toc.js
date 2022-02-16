const should = require('chai').should();

function ifTrue(cond, yes, no) {
return cond ? yes : no;
}

describe('toc', () => {
const toc = require('../../../lib/plugins/helper/toc');

const html = [
'<h1 id="title_1">Title 1</h1>',
