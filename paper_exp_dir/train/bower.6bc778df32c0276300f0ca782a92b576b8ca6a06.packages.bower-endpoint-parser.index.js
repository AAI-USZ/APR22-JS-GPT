function decompose(endpoint) {

var regExp = /^(?:([\w\-]|(?:[\w\.\-]+[\w\-])?)=)?([^\|#]+)(?:#(.*))?$/;
var matches = endpoint.match(regExp);
var target;
var error;

if (!matches) {
error = new Error('Invalid endpoint: ' + endpoint);
error.code = 'EINVEND';
throw error;
}

target = trim(matches[3]);

return {
name: trim(matches[1]),
source: trim(matches[2]),
target: isWildcard(target) ? '*' : target
};
}

function compose(decEndpoint) {
var name = trim(decEndpoint.name);
var source = trim(decEndpoint.source);
var target = trim(decEndpoint.target);
var composed = '';

if (name) {
composed += name + '=';
}

composed += source;

if (!isWildcard(target)) {
composed += '#' + target;
}

return composed;
}

function json2decomposed(key, value) {
var endpoint;
var split;
var error;

key = trim(key);
value = trim(value);

if (!key) {
error = new Error('The key must be specified');
error.code = 'EINVEND';
throw error;
}

endpoint = key + '=';
split = value.split('#').map(trim);


if (split.length > 1) {
endpoint += (split[0] || key) + '#' + split[1];

} else if (isSource(value)) {
endpoint += value + '#*';

} else {
endpoint += key + '#' + split[0];
}

return decompose(endpoint);
}

function decomposed2json(decEndpoint) {
var error;
var name = trim(decEndpoint.name);
var source = trim(decEndpoint.source);
var target = trim(decEndpoint.target);
var value = '';
var ret = {};

if (!name) {
error = new Error('Decomposed endpoint must have a name');
error.code = 'EINVEND';
throw error;
}


if (source !== name) {
value += source;
}


if (!value) {
if (isWildcard(target)) {
value += '*';
} else {
if (target.indexOf('/') !== -1) {
value += '#' + target;
} else {
value += target;
}
}

} else if (!isWildcard(target) || !isSource(source)) {
value += '#' + (target || '*');
}

ret[name] = value;

return ret;
}

function trim(str) {
return str ? str.trim() : '';
}

function isWildcard(target) {
return !target || target === '*' || target === 'latest';
}

function isSource(value) {
return /[\/\\@]/.test(value);
}

module.exports.decompose = decompose;
module.exports.compose = compose;
module.exports.json2decomposed = json2decomposed;
module.exports.decomposed2json = decomposed2json;
