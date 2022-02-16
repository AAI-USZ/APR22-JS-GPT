



var _ = require('lodash'),
yaml = require('yamljs'),
moment = require('moment'),
escape = require('./escape').yaml;

var rYFM = /^(?:-{3,}\s*\n+)?([\s\S]+?)(?:\n+-{3,})(?:\s*\n+([\s\S]*))?/;

exports = module.exports = function(str){
return parse(str);
};


var split = exports.split = function(str){
if (!rYFM.test(str)){
return {content: str};
}

var match = str.match(rYFM),
data = match[1],
content = match[2] || '';

