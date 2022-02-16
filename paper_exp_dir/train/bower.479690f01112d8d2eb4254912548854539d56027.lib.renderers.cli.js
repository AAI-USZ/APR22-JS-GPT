var mout = require('mout');

var sizes = {
tag: 10,
label: 23,
sumup: 5
};
var tagColors = {
'warn': 'yellow',
'error': 'red',
'default': 'cyan'
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
return mout.string.rpad(tag, sizes.tag)[tagColor];
}

label = data.origin + '#' + data.endpoint.target;
length = tag.length + label.length + 1;
nrSpaces = sizes.tag + sizes.label - length;


if (nrSpaces < 1) {
sizes.label = label.length + sizes.sumup;
nrSpaces = sizes.tag + sizes.label - length;
}


return label.green + mout.string.repeat(' ', nrSpaces) + tag[tagColor];
}



var colorful = {
begin: function () {},
end: function () {},
error: function (err) {
var str;

str = 'bower ' + renderTagPlusLabel(err) + ' ' + (err.code ? err.code + ' ,' : '') + err.message + '\n';


if (err.details) {
str += err.details + '\n';
}


str += '\n' + err.stack + '\n';

this._write(process.stderr, str);
},
data: function (data) {
data.data = data.data || '';

this._write(process.stdout, 'bower ' + renderTagPlusLabel(data) + ' ' + data.data + '\n');
},
checkout: function (data) {
if (isCompact()) {
data.data = data.origin + '#' + data.data;
}

this.data(data);
},
_write: function (channel, str) {
channel.write(str);
}
};


var colorless = mout.object.mixIn({}, colorful, {
_write: function (channel, str) {
channel.write(uncolor(str));
}
});

module.exports.colorful = colorful;
module.exports.colorless = colorless;
