var url = require('url');


var createProxyHandler = function(proxy, proxies) {
var proxiesList = Object.keys(proxies || {}).sort().reverse();

if (!proxiesList.length) {
return function() {
return false;
};
}

return function(request, response) {
for (var i = 0; i < proxiesList.length; i++) {
if (request.url.indexOf(proxiesList[i]) === 0) {
var proxiedUrl = url.parse(proxies[proxiesList[i]]);
