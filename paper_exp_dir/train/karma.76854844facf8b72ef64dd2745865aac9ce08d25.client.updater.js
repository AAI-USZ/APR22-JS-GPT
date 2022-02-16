var VERSION = require('./constants').VERSION

var StatusUpdater = function (socket, titleElement, bannerElement, browsersElement) {
var updateBrowsersInfo = function (browsers) {
var items = []
var status
for (var i = 0; i < browsers.length; i++) {
status = browsers[i].isReady ? 'idle' : 'executing'
items.push('<li class="' + status + '">' + browsers[i].name + ' is ' + status + '</li>')
}
browsersElement.innerHTML = items.join('\n')
}

var updateBanner = function (status) {
