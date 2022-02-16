import path from 'path'

describe('reporter', function () {
var loadFile = require('mocks').loadFile
var m = null

beforeEach(function () {
m = loadFile(path.join(__dirname, '/../../../lib/reporters/base.js'))
return m
})

