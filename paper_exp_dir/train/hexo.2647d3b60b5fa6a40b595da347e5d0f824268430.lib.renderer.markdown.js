var marked = require('marked'),
highlight = require('../highlight'),
extend = require('../extend');

marked.setOptions({
gfm: true,
pedantic: false,
sanitize: false,
highlight: highlight
});

var markdown = function(file, content){
return marked(content);
};

extend.renderer.register('md', 'html', markdown, true);
extend.renderer.register('markdown', 'html', markdown, true);
extend.renderer.register('mkd', 'html', markdown, true);
