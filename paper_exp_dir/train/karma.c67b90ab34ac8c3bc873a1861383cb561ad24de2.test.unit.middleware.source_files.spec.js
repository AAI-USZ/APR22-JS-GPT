const http = require('http')
const mocks = require('mocks')
const request = require('supertest')
var zlib = require('zlib')

const helper = require('../../../lib/helper')
const File = require('../../../lib/file')
const createServeFile = require('../../../lib/middleware/common').createServeFile
const createSourceFilesMiddleware = require('../../../lib/middleware/source_files').create

describe('middleware.source_files', function () {
let next
let files
let server = next = files = null
