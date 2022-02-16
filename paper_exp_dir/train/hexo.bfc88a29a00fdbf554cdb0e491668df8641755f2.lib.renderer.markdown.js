var marked = require('marked'),
highlight = require('../util').highlight,
extend = require('../extend');

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
