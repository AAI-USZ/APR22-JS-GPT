var marked = require('marked'),
highlight = require('../util').highlight,
extend = require('../extend'),
_ = require('underscore');

var defaults = {
gfm: true,
pedantic: false,
sanitize: false,
highlight: function(code, lang){
return highlight(code, {lang: lang, gutter: false});
}
