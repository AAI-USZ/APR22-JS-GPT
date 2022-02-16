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
var mockSocketServer
var mockExecutor
var doneSpy
var server = mockConfig = browserCollection = webServerOnError = null
var fileListOnResolve = fileListOnReject = mockLauncher = null
var mockFileList = mockWebServer = mockSocketServer = mockExecutor = doneSpy = null


beforeEach(function () {

this.timeout(4000)
browserCollection = new BrowserCollection()
doneSpy = sinon.spy()

fileListOnResolve = fileListOnReject = null

doneSpy = sinon.spy()
