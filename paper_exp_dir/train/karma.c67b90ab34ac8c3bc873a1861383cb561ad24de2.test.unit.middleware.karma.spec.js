'use strict'

const mocks = require('mocks')

const helper = require('../../../lib/helper')
const constants = require('../../../lib/constants')
const File = require('../../../lib/file')
const Url = require('../../../lib/url')

const HttpResponseMock = mocks.http.ServerResponse
const HttpRequestMock = mocks.http.ServerRequest

describe('middleware.karma', () => {
let serveFile
let filesDeferred
let nextSpy
