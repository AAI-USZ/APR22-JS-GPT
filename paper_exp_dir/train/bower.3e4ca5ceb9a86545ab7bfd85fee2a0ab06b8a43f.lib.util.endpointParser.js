var createError = require('./createError');

function decompose(endpoint) {
var regExp = /^(?:([\w\-]|(?:[\w\.\-]+[\w\-])?)=)?([^\|#]+)(?:#(.*))?$/;
var matches = endpoint.match(regExp);
var target;

if (!matches) {
throw createError('Invalid endpoint: ' + endpoint, 'EINVEND');
}
