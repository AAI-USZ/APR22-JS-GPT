'use strict';

describe('Tag Errors', () => {
const Tag = require('../../../lib/extend/tag');

const assertNunjucksError = (err, line, type) => {
err.should.have.property('name', 'Nunjucks Error');
err.should.have.property('message');
err.should.have.property('line', line);
err.should.have.property('type', type);
};

