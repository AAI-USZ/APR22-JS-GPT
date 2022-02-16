var mout = require('mout');

var paddings = {
tag: 10,
label: 23
};
var tagColors = {
'warn': 'yellow',
'error': 'red',
'default': 'cyan',
};

function isCompact() {
return process.stdout.columns < 120;
}

function uncolor(str) {
return str.replace(/\x1B\[\d+m/g, '');
}

function renderTagPlusLabel(data) {
var label;
var length;
var nrSpaces;
var tag = data.tag;
var tagColor = tagColors[data.level] || tagColors['default'];


if (isCompact()) {
return mout.string.rpad(tag, paddings.tag)[tagColor];
}

label = data.origin + '#' + data.endpoint.target;
length = tag.length + label.length + 1;
nrSpaces = paddings.tag + paddings.label - length;


if (nrSpaces < 1) {
paddings.label = label.length;
nrSpaces = paddings.tag + paddings.label - length;
}


return label.green + mout.string.repeat(' ', nrSpaces) + tag[tagColor];
}



var colorful = {
