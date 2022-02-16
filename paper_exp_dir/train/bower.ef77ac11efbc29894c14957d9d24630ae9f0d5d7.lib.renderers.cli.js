var mout = require('mout');

var paddings = {
tag: 10,
tagPlusLabel: 31
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
err.tag = err.code;

str = 'bower ' + renderTagPlusLabel(err) + ' ' + err.message + '\n';


if (err.details) {
str += err.details + '\n';
}


str += '\n' + err.stack + '\n';

return str;
}

function renderEnd() {
return '';
}

function renderCheckout(data) {
if (isCompact()) {
data.data = data.origin + '#' + data.data;
}

return renderData(data);
}


