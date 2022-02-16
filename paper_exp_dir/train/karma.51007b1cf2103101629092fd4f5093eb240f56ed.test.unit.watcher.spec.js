const mocks = require('mocks')
const path = require('path')

describe('watcher', () => {
const config = require('../../lib/config')

let m = null

beforeEach(() => {
const mocks_ = {chokidar: mocks.chokidar}
m = mocks.loadFile(path.join(__dirname, '/../../lib/watcher.js'), mocks_)
})

describe('watchPatterns', () => {
let chokidarWatcher = null

beforeEach(() => {
chokidarWatcher = new mocks.chokidar.FSWatcher()
})

it('should watch all the patterns', () => {
m.watchPatterns(['/some/*.js', '/a/*'], chokidarWatcher)
expect(chokidarWatcher.watchedPaths_).to.deep.equal(['/some', '/a'])
