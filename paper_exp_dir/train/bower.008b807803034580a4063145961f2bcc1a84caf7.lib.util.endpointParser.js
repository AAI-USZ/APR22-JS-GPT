var createError = require('./createError');

function decompose(endpoint) {
var regExp = /^(?:([\w\-]|(?:[\w\.\-]+[\w\-])?)=)?([^\|#]+)(?:#(.*))?$/;
var matches = endpoint.match(regExp);
var target;

if (!matches) {
throw createError('Invalid endpoint: ' + endpoint, 'EINVEND');
}

target = matches[3];

return {
name: matches[1] || '',
source: matches[2],
target: !target || target === 'latest' ? '*' : target
};
}

function compose(decEndpoint) {
var composed = '';

if (decEndpoint.name) {
composed += decEndpoint.name + '=';
}

composed += decEndpoint.source;

if (decEndpoint.target) {
composed += '#' + decEndpoint.target;
}

return composed;
}

function json2decomposed(key, value) {
var endpoint = key + '=';
var split = value.split('#');


if (split.length > 1) {
endpoint += split[0] + '#' + split[1];

} else if (value.indexOf('/') !== -1) {
endpoint += value + '#*';

} else {
endpoint += key + '#' + split[0];
}

return decompose(endpoint);
}

function decomposed2json(decEndpoint) {
var key = decEndpoint.name;
