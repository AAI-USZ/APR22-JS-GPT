var should = require('chai').should(),
qs = require('querystring'),
htmlTag = require('../../../lib/util/html_tag');

describe('tag', function(){
var tag = require('../../../lib/plugins/helper/tag'),
url_for = require('../../../lib/plugins/helper/url').url_for;

var context = {
url_for: url_for
