



var _ = require('lodash'),
yaml = require('yamljs'),
escape = require('./escape').yaml;

var rYFM = /^(-{3,}\s+)?([\s\S]+?)-{3,}\s{0,}([\s\S]*)/;

var yfm = module.exports = function(str){
return parse(str);
};



var parse = yfm.parse = function(str){
if (!rYFM.test(str)){
return {_content: str};
}

var match = str.match(rYFM),
raw = match[2],
content = match[3] || '';

try {
var data = yaml.parse(escape(raw));

if (typeof data === 'object'){
return _.extend(data, {_content: content});
} else {
return {_content: str};
}
} catch (e){
return {_content: str};
}
};



yfm.stringify = function(obj){
var data = _.omit(obj, '_content'),
content = obj._content || '',
keys = Object.keys(data);

if (keys.length){
return yaml.stringify(data) + '\n---\n' + content;
} else {
return content;
}
};
