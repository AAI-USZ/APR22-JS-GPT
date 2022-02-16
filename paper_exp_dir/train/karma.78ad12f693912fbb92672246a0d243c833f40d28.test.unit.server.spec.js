var Server = require('../../lib/server')
var BrowserCollection = require('../../lib/browser_collection')
var fs = require('fs')
var path = require('path')

describe('server', () => {
var mockConfig
var browserCollection
var webServerOnError
var fileListOnReject
var mockLauncher
var mockWebServer
