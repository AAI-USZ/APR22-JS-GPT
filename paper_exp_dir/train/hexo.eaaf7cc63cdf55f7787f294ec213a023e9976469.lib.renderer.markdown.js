var marked = require('marked'),
_ = require('underscore'),
hljs = require('highlight.js'),
extend = require('../extend');

var regex = {
backtick: /^`{3}\s*([^\n]+)\n([^`]+)/,
captionUrl: /([^\s]+)\s*(.*)(https?:\/\/\S+)\s*(.*)/,
caption: /([^\s]+)\s*(.*)/
};

marked.setOptions({
gfm: true,
pedantic: false,
sanitize: false,
highlight: function(code, lang){
try {
return hljs.highlight(lang, code).value;
} catch (e){
return hljs.highlightAuto(code).value;
}
}
});

