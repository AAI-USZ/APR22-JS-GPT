



var _ = require('lodash'),
yaml = require('yamljs'),
escape = require('./escape').yaml;

var yfm = module.exports = function(source){
var content = source.replace(/^-{3,}/, '').split(/-{3,}/),
result = {};

if (content.length === 1){
result = {_content: content[0]};
} else {
result = yaml.parse(escape(content.shift()));
result._content = content.join('---').replace(/^\n*/, '');
}

return result;
};



yfm.parse = function(source){
return yfm(source);
};



yfm.stringify = function(obj){
return yaml.stringify(_.omit(obj, '_content')) + '\n---\n' + obj._content;
};
