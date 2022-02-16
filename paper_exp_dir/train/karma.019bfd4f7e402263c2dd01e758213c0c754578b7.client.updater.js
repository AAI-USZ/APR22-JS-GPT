var VERSION = require('./constants').VERSION

function StatusUpdater (socket, titleElement, bannerElement, browsersElement) {
function updateBrowsersInfo (browsers) {
if (!browsersElement) {
return
}
var status


while (browsersElement.firstChild) {
browsersElement.removeChild(browsersElement.firstChild)
}

for (var i = 0; i < browsers.length; i++) {
status = browsers[i].isConnected ? 'idle' : 'executing'
var li = document.createElement('li')
li.setAttribute('class', status)
