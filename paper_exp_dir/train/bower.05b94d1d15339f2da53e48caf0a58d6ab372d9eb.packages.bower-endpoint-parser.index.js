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
