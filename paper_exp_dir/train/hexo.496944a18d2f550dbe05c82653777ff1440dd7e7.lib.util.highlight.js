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
rb: 'ruby',
csharp: 'cs'
};

var keys = Object.keys(alias);



module.exports = function(str, options){
options = _.extend({
gutter: true,
wrap: true,
