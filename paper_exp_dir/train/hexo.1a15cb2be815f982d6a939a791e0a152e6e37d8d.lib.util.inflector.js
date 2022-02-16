

var plurals = [],
singulars = [],
uncountables = [];

var words = [
'a', 'an', 'and', 'as', 'at', 'but', 'by', 'en', 'for', 'if', 'in', 'of', 'on',
'or', 'the', 'to', 'v', 'v.', 'via', 'vs', 'vs.'
];

var plural = function(key, value){
plurals.push([key, value]);
};

var singular = function(key, value){
singulars.push([key, value]);
};

var irregular = function(key, value){
plural(new RegExp('(' + key + ')$', 'i'), value);
singular(new RegExp('(' + value + ')$', 'i'), key);
