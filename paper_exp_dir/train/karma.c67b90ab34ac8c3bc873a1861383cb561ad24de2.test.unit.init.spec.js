const path = require('path')

describe('init', () => {
const loadFile = require('mocks').loadFile
let m = null

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/init.js'), {glob: require('glob')})
sinon.stub(m, 'installPackage')
})

describe('getBasePath', () => {

const replace = (p) => p.replace(/\

it('should be empty if config file in cwd', () => {
expect(m.getBasePath('some.conf', replace('/usr/local/whatever'))).to.equal('')
})

it('should handle leading "./', () => {
expect(m.getBasePath(replace('./some.conf'), replace('/usr/local/whatever'))).to.equal('')
})

it('should handle config file in subfolder', () => {

const file = replace('sub/folder/file.conf')
expect(m.getBasePath(file, replace('/usr/local'))).to.equal(replace('../..'))
})

it('should handle config in a parent path', () => {

const basePath = m.getBasePath(replace('../../../file.js'), replace('/home/vojta/tc/project'))
expect(basePath).to.equal(replace('vojta/tc/project'))
})

it('should handle config in parent subfolder', () => {

const f = replace('../../other/f.js')
expect(m.getBasePath(f, replace('/home/vojta/tc/prj'))).to.equal(replace('../tc/prj'))
})

it('should handle absolute paths', () => {
const basePath = m.getBasePath(replace('/Users/vojta/karma/conf.js'), replace('/Users/vojta'))
expect(basePath).to.equal(replace('..'))
})
})

describe('processAnswers', () => {
const answers = (obj) => {
obj = obj || {}
obj.files = obj.files || []
obj.exclude = obj.exclude || []
obj.browsers = obj.browsers || []
return obj
}

it('should add requirejs and set files non-included if requirejs used', () => {
const processedAnswers = m.processAnswers(answers({
