'use strict';

var should = require('chai').should();

describe('url_for', function(){
var ctx = {
config: {},
relative_url: require('../../../lib/plugins/helper/relative_url')
};

var urlFor = require('../../../lib/plugins/helper/url_for').bind(ctx);

