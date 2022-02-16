

var hljs = require('highlight.js'),
_ = require('lodash');



var alias = {
js: 'javascript',
jscript: 'javascript',
html: 'xml',
htm: 'xml',
coffee: 'coffeescript',
'coffee-script': 'coffeescript',
yml: 'yaml',
pl: 'perl',
ru: 'ruby',
rb: 'ruby'
};

var keys = Object.keys(alias);



module.exports = function(str, options){
var defaults = {
gutter: true,
wrap: true,
first_line: 1,
lang: '',
caption: '',
tab: ''
};

var options = _.extend(defaults, options);

if (options.tab){
