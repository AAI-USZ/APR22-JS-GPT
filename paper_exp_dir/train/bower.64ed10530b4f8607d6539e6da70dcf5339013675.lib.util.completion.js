













module.exports = function (argv, env) {
var opts = {};


opts.w = +env.COMP_CWORD;


opts.words = argv.map(function (word) {
return word.charAt(0) === '"' ?
word.replace(/^"|"$/g, '') :
word.replace(/\\ /g, ' ');
});


opts.word = opts.words[opts.w - 1];


opts.line = env.COMP_LINE;


opts.point = +env.COMP_POINT;


opts.length = opts.line.length;




opts.partialLine = opts.line.slice(0, opts.point);




opts.partialWords = opts.words.slice(0, opts.w);

return opts;
};

module.exports.log = function (arr, opts) {
arr = Array.isArray(arr) ? arr : [arr];
arr.filter(module.exports.abbrev(opts)).forEach(function (word) {
console.log(word);
});
};

module.exports.abbrev = function abbrev(opts) {
var word = opts.word.replace(/\./g, '\\.');
return function (it) {
return new RegExp('^' + word).test(it);
};
};
