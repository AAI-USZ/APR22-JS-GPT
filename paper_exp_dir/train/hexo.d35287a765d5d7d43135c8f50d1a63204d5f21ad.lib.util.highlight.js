var hljs = require('highlight.js'),
_ = require('lodash');

hljs.configure({
classPrefix: ''
});

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
options = _.extend({
gutter: true,
wrap: true,
first_line: 1,
lang: '',
caption: '',
tab: ''
}, options);

if (options.tab){
str = str.replace(/\n(\t+)/g, function(match, tabs){
var result = '\n';

for (var i = 0, len = tabs.length; i < len; i++){
result += options.tab;
}

