const EventEmitter = require('events').EventEmitter
const request = require('supertest')
const di = require('di')
const mocks = require('mocks')
const fs = require('fs')
const mime = require('mime')
const path = require('path')

describe('web-server', () => {
let server
let emitter
const File = require('../../lib/file')

const _mocks = {}
const _globals = {__dirname: '/karma/lib'}

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



const m = mocks.loadFile(path.join(__dirname, '/../../lib/web-server.js'), _mocks, _globals)
let customFileHandlers = server = emitter = null
let beforeMiddlewareActive = false
let middlewareActive = false
const servedFiles = (files) => {
emitter.emit('file_list_modified', {included: [], served: files})
}

describe('request', () => {
beforeEach(() => {
customFileHandlers = []
emitter = new EventEmitter()
const config = {
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

const injector = new di.Injector([{
config: ['value', config],
customFileHandlers: ['value', customFileHandlers],
emitter: ['value', emitter],
fileList: ['value', {files: {served: [], included: []}}],
filesPromise: ['factory', m.createFilesPromise],
serveStaticFile: ['factory', m.createServeStaticFile],
serveFile: ['factory', m.createServeFile],
readFilePromise: ['factory', m.createReadFilePromise],
capturedBrowsers: ['value', null],
reporter: ['value', null],
executor: ['value', null],
proxies: ['value', null],
'middleware:beforeCustom': ['factory', function (config) {
return function (request, response, next) {
if (beforeMiddlewareActive) {
response.writeHead(223)
return response.end('hello from before middleware!')
