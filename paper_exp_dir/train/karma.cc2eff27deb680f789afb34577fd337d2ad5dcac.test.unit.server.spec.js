const Server = require('../../lib/server')
const BundleUtils = require('../../lib/utils/bundle-utils')
const NetUtils = require('../../lib/utils/net-utils')
const BrowserCollection = require('../../lib/browser_collection')
const Browser = require('../../lib/browser')

describe('server', () => {
let mockConfig
let browserCollection
let webServerOnError
let fileListOnReject
let mockLauncher
let mockWebServer
let mockServerSocket
