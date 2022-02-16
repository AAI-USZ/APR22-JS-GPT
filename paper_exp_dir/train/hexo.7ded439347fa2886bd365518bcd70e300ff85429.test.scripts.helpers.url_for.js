'use strict';

require('chai').should();

describe('url_for', () => {
const ctx = {
config: {},
relative_url: require('../../../lib/plugins/helper/relative_url')
};

const urlFor = require('../../../lib/plugins/helper/url_for').bind(ctx);

