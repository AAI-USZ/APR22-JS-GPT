var path = require('path')

describe('init', () => {
var loadFile = require('mocks').loadFile
var m = null

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/init.js'), {glob: require('glob')})
sinon.stub(m, 'installPackage')
})
