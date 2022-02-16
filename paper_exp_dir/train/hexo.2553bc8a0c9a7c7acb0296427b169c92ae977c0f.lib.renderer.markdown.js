var marked = require('marked'),
highlight = require('../util').highlight,
extend = require('../extend');

marked.setOptions({
gfm: true,
pedantic: false,
sanitize: false
});

var markdown = function(file, content){
