

var _ = require('lodash'),
yaml = require('yamljs');



var yfm = module.exports = function(source){
var content = source.replace(/^-{3}/, '').split('---');

if (content.length === 1){
var result = {_content: content[0]};
} else {
var result = yaml.parse(content.shift());
result._content = content.join('---').replace(/^\n*/, '');
