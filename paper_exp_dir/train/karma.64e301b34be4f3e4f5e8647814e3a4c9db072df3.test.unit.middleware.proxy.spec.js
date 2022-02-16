import path from 'path'
var httpMock = require('mocks').http
var loadFile = require('mocks').loadFile

describe('middleware.proxy', () => {
var requestedUrl
var response
var nextSpy
var type

