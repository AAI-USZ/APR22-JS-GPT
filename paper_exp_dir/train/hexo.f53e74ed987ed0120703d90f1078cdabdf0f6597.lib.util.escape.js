



exports.filename = function(str, transform){
var result = exports.diacritic(str.toString())
.replace(/\s/g, '-')
.replace(/\/|\\|\?|%|\*|:|\||'|"|<|>|\.|#/g, '');

transform = parseInt(transform, 10);

if (transform === 1){
result = result.toLowerCase();
} else if (transform === 2){
result = result.toUpperCase();
}

return result;
};

/**
* Converts the string to a proper path.
*
* Transform:
*   - 1: Lower case
*   - 2: Upper case
*
* @method path
* @param {String} str
* @param {Number} transform
* @return {String}
* @static
*/

exports.path = function(str, transform){
var result = str.toString()
.replace(/\s/g, '-')
.replace(/:|\/|\?|#|\[|\]|@|!|\$|&|'|\(|\)|\*|\+|,|;|=|\\|%|<|>|\./g, '');

transform = parseInt(transform, 10);

if (transform === 1){
result = result.toLowerCase();
} else if (transform === 2){
result = result.toUpperCase();
}

return result;
};



exports.yaml = require('hexo-front-matter').escape;


exports.regex = function(str){

return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

var defaultDiacriticsRemovalap = [
{'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
{'base':'AA','letters':'\uA732'},
