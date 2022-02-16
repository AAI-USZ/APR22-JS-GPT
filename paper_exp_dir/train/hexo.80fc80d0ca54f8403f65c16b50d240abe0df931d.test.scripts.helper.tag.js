var should = require('chai').should(),
qs = require('querystring'),
htmlTag = require('../../../lib/util/html_tag');

describe('tag', function(){
var tag = require('../../../lib/plugins/helper/tag'),
context = require('../../../lib/plugins/helper/url');

describe('css', function(){
var css = tag.css.bind(context);

var genResult = function(arr){
var result = '';

arr.forEach(function(item){
result += htmlTag('link', {rel: 'stylesheet', href: item + '.css', type: 'text/css'}) + '\n';
});
