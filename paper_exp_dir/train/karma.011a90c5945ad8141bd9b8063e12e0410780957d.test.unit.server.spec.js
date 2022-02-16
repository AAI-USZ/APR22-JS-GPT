var Server = require('../../lib/server')
var BundleUtils = require('../../lib/utils/bundle-utils')
var BrowserCollection = require('../../lib/browser_collection')

describe('server', () => {
var mockConfig
var browserCollection
var webServerOnError
var fileListOnReject
var mockLauncher
var mockWebServer
