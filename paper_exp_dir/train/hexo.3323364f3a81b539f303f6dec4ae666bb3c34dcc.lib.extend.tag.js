var stripIndent = require('strip-indent');
var swig = require('swig');

var placeholder = String.fromCharCode(65535);
var rPlaceholder = new RegExp(placeholder + '(\\d+)' + placeholder, 'g');

function Tag(){
this.swig = new swig.Swig({
autoescape: false
});
}
