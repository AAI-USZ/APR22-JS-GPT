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
li.textContent = browsers[i].name + ' is ' + status
browsersElement.appendChild(li)
}
}

var connectionText = 'never-connected'
var testText = 'loading'
var pingText = ''

function updateBanner () {
if (!titleElement || !bannerElement) {
return
}
bannerElement.className = connectionText === 'connected' ? 'online' : 'offline'
}

function updateConnectionStatus (connectionStatus) {
connectionText = connectionStatus || connectionText
updateBanner()
}
function updateTestStatus (testStatus) {
testText = testStatus || testText
updateBanner()
}
function updatePingStatus (pingStatus) {
pingText = pingStatus || pingText
updateBanner()
}

updateConnectionStatus('connected')
})
