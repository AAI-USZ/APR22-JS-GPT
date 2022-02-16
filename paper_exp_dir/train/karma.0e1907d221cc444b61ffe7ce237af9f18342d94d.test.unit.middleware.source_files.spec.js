import http from 'http'
import mocks from 'mocks'
import request from 'supertest'
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
return http.createServer(function (req, res) {
next = sinon.spy(function (err) {
if (err) {
res.statusCode = err.status || 500
return res.end(err.message)
} else {
res.statusCode = 200
return res.end(JSON.stringify(req.body))
}
})

return handler(req, res, next)
})
}

beforeEach(function () {
files = helper.defer()
server = createServer(files, serveFile, '/base/path')
return server
})

afterEach(function () {
return next.reset()
})

var servedFiles = function (list) {
return files.resolve({included: [], served: list})
}

describe('Range headers', function () {
beforeEach(function () {
servedFiles([
new File('/src/some.js')
])
})

it('allows single explicit ranges', function () {
return request(server)
.get('/absolute/src/some.js')
.set('Range', 'bytes=3-6')
.expect('Content-Range', 'bytes 3-6/9')
.expect(206, 'sour')
})

it('allows single range with no end', function () {
return request(server)
.get('/absolute/src/some.js')
.set('Range', 'bytes=3-')
.expect('Content-Range', 'bytes 3-8/9')
.expect(206, 'source')
})

it('allows single range with suffix', function () {
return request(server)
.get('/absolute/src/some.js')
.set('Range', 'bytes=-5')
.expect('Content-Range', 'bytes 4-8/9')
.expect(206, 'ource')
})

it('doesn\'t support multiple ranges', function () {
return request(server)
.get('/absolute/src/some.js')
.set('Range', 'bytes=0-2,-3')
.expect(416, '')
})

it('will return 416', function () {
return request(server)
.get('/absolute/src/some.js')
.set('Range', 'bytes=20-')
.expect(416, '')
})
})

it('should serve absolute js source files ignoring timestamp', function () {
servedFiles([
new File('/src/some.js')
])

return request(server)
.get('/absolute/src/some.js?123345')
.expect(200, 'js-source')
})

it('should serve js source files from base folder ignoring timestamp', function () {
servedFiles([
new File('/base/path/a.js')
])

return request(server)
.get('/base/a.js?123345')
.expect(200, 'js-src-a')
.then(function () {
return expect(next).not.to.have.been.called
})
})

it('should send strict caching headers for js source files with sha', function () {
servedFiles([
new File('/src/some.js')
])

return request(server)
.get('/absolute/src/some.js?df43b8acf136389a8dd989bda397d1c9b4e048be')
