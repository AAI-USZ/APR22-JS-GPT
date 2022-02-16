var stripIndent = require('strip-indent');

var placeholder = String.fromCharCode(65535),
rPlaceholder = new RegExp(placeholder + '(\\d+)' + placeholder, 'g');

function Tag(){
this.store = [];
}

Tag.prototype.list = function(){
return this.store;
