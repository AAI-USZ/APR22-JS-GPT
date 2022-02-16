'use strict';

var cheerio = require('cheerio');
var should = require('chai').should();

var gist = require('../../../lib/plugins/tag/gist');

var $ = cheerio.load(gist(['foo']));
$('script').attr('src').should.eql('//gist.github.com/foo.js');
});

