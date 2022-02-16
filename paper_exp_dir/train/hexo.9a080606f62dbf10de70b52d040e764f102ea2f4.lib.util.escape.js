

exports.filename = function(str, transform){
var result = str.toString().toLowerCase()
.replace(/\s/g, '-')
.replace(/\/|\\|\?|%|\*|:|\||'|"|<|>|\.|#/g, '');

if (transform == 1){
result = result.toLowerCase();
} else if (transform == 2){
result = result.toUpperCase();
}

return result;
};

/**
* Escapes the given `str` to a valid URL.
*
* @param {String} str
* @param {Number} transform
* @return {String}
* @api public
*/

