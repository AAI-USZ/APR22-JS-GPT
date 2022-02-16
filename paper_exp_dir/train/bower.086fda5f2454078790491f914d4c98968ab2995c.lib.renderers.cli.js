var mout = require('mout');

var paddings = {
tag: 10,
tagPlusLabel: 35
};

var tagColors = {
'warn': 'yellow',
'error': 'red',
'_default': 'cyan',
};

function renderData(data) {

data.data = data.data || '';

return 'bower ' + renderTagPlusLabel(data) + ' ' + data.data + '\n';
}

function renderError(err) {
var str;

err.level = 'error';
