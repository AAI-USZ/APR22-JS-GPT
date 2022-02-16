



var _ = require('lodash'),
yaml = require('yamljs'),
escape = require('./escape').yaml;

var yfm = module.exports = function(source){
var content = source.replace(/^-{3}/, '').split('---'),
result = {};

if (content.length === 1){
result = {_content: content[0]};
} else {
result = yaml.parse(escape(content.shift()));
result._content = content.join('---').replace(/^\n*/, '');
}

