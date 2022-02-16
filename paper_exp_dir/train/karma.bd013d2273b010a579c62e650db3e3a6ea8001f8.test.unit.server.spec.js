var Server = require('../../lib/server')
var BrowserCollection = require('../../lib/browser_collection')

describe('server', () => {
var mockConfig
var browserCollection
var webServerOnError
var fileListOnReject
var mockLauncher
var mockWebServer
var mockSocketServer
var mockExecutor
