var http = require('http')
var mocks = require('mocks')
var request = require('supertest')
var zlib = require('zlib')

var helper = require('../../../lib/helper')
var File = require('../../../lib/file')
var createServeFile = require('../../../lib/middleware/common').createServeFile
var createSourceFilesMiddleware = require('../../../lib/middleware/source_files').create

describe('middleware.source_files', function () {
var next
var files
