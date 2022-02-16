var loadFile = require('mocks').loadFile
var path = require('path')

var constant = require('../../lib/constants')

describe('runner', () => {
var m

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/runner.js'))
