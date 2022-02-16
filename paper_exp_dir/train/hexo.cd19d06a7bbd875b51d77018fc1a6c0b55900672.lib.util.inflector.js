

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

