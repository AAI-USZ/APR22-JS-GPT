var EventEmitter = require('events').EventEmitter
var request = require('supertest')
var di = require('di')
var mocks = require('mocks')
var fs = require('fs')
var mime = require('mime')
var path = require('path')

describe('web-server', () => {
var server
var emitter
var File = require('../../lib/file')

var _mocks = {}
var _globals = {__dirname: '/karma/lib'}

_mocks['graceful-fs'] = mocks.fs.create({
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



var m = mocks.loadFile(path.join(__dirname, '/../../lib/web-server.js'), _mocks, _globals)
var customFileHandlers = server = emitter = null
var beforeMiddlewareActive = false
var middlewareActive = false
var servedFiles = (files) => {
emitter.emit('file_list_modified', {included: [], served: files})
}

describe('request', () => {
beforeEach(() => {
customFileHandlers = []
emitter = new EventEmitter()
var config = {
basePath: '/base/path',
urlRoot: '/',
beforeMiddleware: ['beforeCustom'],
middleware: ['custom'],
middlewareResponse: 'hello middleware!',
mime: {'custom/custom': ['custom']},
client: {
useIframe: true,
useSingleWindow: false
}
}

var injector = new di.Injector([{
config: ['value', config],
customFileHandlers: ['value', customFileHandlers],
emitter: ['value', emitter],
fileList: ['value', {files: {served: [], included: []}}],
filesPromise: ['factory', m.createFilesPromise],
serveStaticFile: ['factory', m.createServeStaticFile],
serveFile: ['factory', m.createServeFile],
capturedBrowsers: ['value', null],
reporter: ['value', null],
executor: ['value', null],
proxies: ['value', null],
'middleware:beforeCustom': ['factory', function (config) {
return function (request, response, next) {
if (beforeMiddlewareActive) {
