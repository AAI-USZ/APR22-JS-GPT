const Server = require('../../lib/server')
const NetUtils = require('../../lib/utils/net-utils')
const BrowserCollection = require('../../lib/browser_collection')
const Browser = require('../../lib/browser')
const cfg = require('../../lib/config')
const logger = require('../../lib/logger')

describe('server', () => {
let mockConfig
let browserCollection
let webServerOnError
let fileListOnReject
let mockLauncher
let mockWebServer
