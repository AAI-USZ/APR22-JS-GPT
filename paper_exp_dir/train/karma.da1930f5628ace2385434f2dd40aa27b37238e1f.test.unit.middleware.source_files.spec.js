import http from 'http'
import mocks from 'mocks'
import request from 'supertest-as-promised'
import helper from '../../../lib/helper'
import File from '../../../lib/file'
import {createServeFile} from '../../../lib/middleware/common'
var createSourceFilesMiddleware = require('../../../lib/middleware/source_files').create

describe('middleware.source_files', function () {
var next
var files
var server = next = files = null

var fsMock = mocks.fs.create({
base: {
path: {
'a.js': mocks.fs.file(0, 'js-src-a'),
'index.html': mocks.fs.file(0, '<html>')
}
},
src: {
'some.js': mocks.fs.file(0, 'js-source')
},
'utf8ášč': {
'some.js': mocks.fs.file(0, 'utf8-file')
},
'jenkins%2Fbranch': {
'some.js': mocks.fs.file(0, 'utf8-file')
}
})

var serveFile = createServeFile(fsMock, null)

var createServer = function (f, s, basePath) {
var handler = createSourceFilesMiddleware(f.promise, s, basePath)
