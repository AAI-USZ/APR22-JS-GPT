



exports.filename = function(str, transform){
var result = str.toString().toLowerCase()
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
