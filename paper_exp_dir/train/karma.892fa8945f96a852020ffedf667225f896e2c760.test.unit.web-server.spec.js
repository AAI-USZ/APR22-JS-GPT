require('core-js')
import {EventEmitter} from 'events'
import request from 'supertest-as-promised'
import di from 'di'
import mocks from 'mocks'
import fs from 'fs'

describe('web-server', () => {
var server
var emitter
var File = require('../../lib/file')

var _mocks = {}
var _globals = {__dirname: '/karma/lib'}

_mocks.fs = mocks.fs.create({
karma: {
static: {
'client.html': mocks.fs.file(0, 'CLIENT HTML')
}
},
base: {
path: {
'one.js': mocks.fs.file(0, 'js-source'),
'new.js': mocks.fs.file(0, 'new-js-source')
}
}
})



var m = mocks.loadFile(__dirname + '/../../lib/web-server.js', _mocks, _globals)

var customFileHandlers = server = emitter = null

var servedFiles = (files) => {
emitter.emit('file_list_modified', {included: [], served: files})
}

describe('request', () => {

beforeEach(() => {
customFileHandlers = []
emitter = new EventEmitter()

var injector = new di.Injector([{
config: ['value', {basePath: '/base/path', urlRoot: '/'}],
customFileHandlers: ['value', customFileHandlers],
emitter: ['value', emitter],
fileList: ['value', {files: {served: [], included: []}}],
capturedBrowsers: ['value', null],
reporter: ['value', null],
executor: ['value', null],
proxies: ['value', null]
}])

server = injector.invoke(m.createWebServer)
})

it('should serve client.html', () => {
servedFiles(new Set())

return request(server)
.get('/')
.expect(200, 'CLIENT HTML')
})

it('should serve source files', () => {
servedFiles(new Set([new File('/base/path/one.js')]))

return request(server)
.get('/base/one.js')
.expect(200, 'js-source')
})

it('should serve updated source files on file_list_modified', () => {
servedFiles(new Set([new File('/base/path/one.js')]))
servedFiles(new Set([new File('/base/path/new.js')]))

return request(server)
.get('/base/new.js')
.expect(200, 'new-js-source')
})

it('should serve no files when they are not available yet', () => {
return request(server)
.get('/base/new.js')
.expect(404)
.then(() => {
servedFiles(new Set([new File('/base/path/new.js')]))

return request(server)
.get('/base/new.js')
