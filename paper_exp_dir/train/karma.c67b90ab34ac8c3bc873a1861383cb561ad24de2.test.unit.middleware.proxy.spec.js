const path = require('path')
const httpMock = require('mocks').http
const loadFile = require('mocks').loadFile

describe('middleware.proxy', () => {
let requestedUrl
let response
let nextSpy
let type
let m = loadFile(path.join(__dirname, '/../../../lib/middleware/proxy.js'))

const mockProxies = [{
