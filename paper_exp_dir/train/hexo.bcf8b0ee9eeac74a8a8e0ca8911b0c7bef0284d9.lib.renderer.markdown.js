var marked = require('marked'),
_ = require('underscore'),
highlight = require('../util').highlight,
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
return highlight(code, {lang: lang, gutter: false});
}
});

var markdown = function(file, content){
return marked(content);
};

extend.renderer.register('md', 'html', markdown, true);
extend.renderer.register('markdown', 'html', markdown, true);
