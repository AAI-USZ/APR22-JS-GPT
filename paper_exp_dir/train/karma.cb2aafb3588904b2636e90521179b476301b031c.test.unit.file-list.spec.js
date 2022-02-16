import Promise from 'bluebird'
import {EventEmitter} from 'events'
import mocks from 'mocks'
import proxyquire from 'proxyquire'
var helper = require('../../lib/helper')
var _ = helper._

var from = require('core-js/library/fn/array/from')
var config = require('../../lib/config')


var patterns = (...strings) => strings.map(str => new config.Pattern(str))

function pathsFrom (files) {
return _.pluck(from(files), 'path')
}

function findFile (path, files) {
return from(files).find(file => file.path === path)
}

var PATTERN_LIST = {
'/some/*.js': ['/some/a.js', '/some/b.js'],
'*.txt': ['/c.txt', '/a.txt', '/b.txt'],
'/a.*': ['/a.txt']
}

var MG = {
statCache: {
'/some/a.js': {mtime: new Date()},
'/some/b.js': {mtime: new Date()},
'/a.txt': {mtime: new Date()},
'/b.txt': {mtime: new Date()},
'/c.txt': {mtime: new Date()}
}
}
var mockFs = mocks.fs.create({
some: {'0.js': mocks.fs.file('2012-04-04'),
'a.js': mocks.fs.file('2012-04-04'),
'b.js': mocks.fs.file('2012-05-05'),
'd.js': mocks.fs.file('2012-05-05')},
folder: {'x.js': mocks.fs.file(0)},
'a.txt': mocks.fs.file(0),
'b.txt': mocks.fs.file(0),
'c.txt': mocks.fs.file(0),
'a.js': mocks.fs.file('2012-01-01')
})

describe('FileList', () => {
var list
var emitter
var preprocess
var patternList
var mg
var modified
var glob
var List = list = emitter = preprocess = patternList = mg = modified = glob = null

beforeEach(() => {})

describe('files', () => {
beforeEach(() => {
patternList = PATTERN_LIST
mg = MG
preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()

glob = {
Glob: (pattern, opts) => ({
found: patternList[pattern],
statCache: mg.statCache
})
}

List = proxyquire('../../lib/file-list', {
helper: helper,
glob: glob,
fs: mockFs
})
})

it('returns a flat array of served files', () => {
list = new List(patterns('/some/*.js'), [], emitter, preprocess)

return list.refresh().then(() => {
expect(list.files.served).to.have.length(2)
})
})

it('returns a unique set', () => {
list = new List(patterns('/a.*', '*.txt'), [], emitter, preprocess)

return list.refresh().then(() => {
expect(list.files.served).to.have.length(3)
expect(pathsFrom(list.files.served)).to.contain('/a.txt', '/b.txt', '/c.txt')
})
})

it('returns only served files', () => {
var files = [
new config.Pattern('/a.*', true),
new config.Pattern('/some/*.js', false)
]

list = new List(files, [], emitter, preprocess)

return list.refresh().then(() => {
expect(pathsFrom(list.files.served)).to.eql(['/a.txt'])
})
})

it('marks no cache files', () => {
var files = [
new config.Pattern('/a.*'),
new config.Pattern('/some/*.js', true, true, true, true)
]

list = new List(files, [], emitter, preprocess)

return list.refresh().then(() => {
expect(pathsFrom(list.files.served)).to.deep.equal([
'/a.txt',
'/some/a.js',
'/some/b.js'
])
expect(preprocess).to.have.been.calledOnce
expect(list.files.served[0].doNotCache).to.be.false
expect(list.files.served[1].doNotCache).to.be.true
expect(list.files.served[2].doNotCache).to.be.true
})
})

it('returns a flat array of included files', () => {
var files = [
new config.Pattern('/a.*', true, false),
new config.Pattern('/some/*.js')
]

list = new List(files, [], emitter, preprocess)

return list.refresh().then(() => {
expect(pathsFrom(list.files.included)).not.to.contain('/a.txt')
expect(pathsFrom(list.files.included)).to.deep.equal([
'/some/a.js',
'/some/b.js'
])
})
})
})

describe('_isExcluded', () => {
beforeEach(() => {
preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()
})

it('returns undefined when no match is found', () => {
list = new List([], ['hello.js', 'world.js'], emitter, preprocess)
expect(list._isExcluded('hello.txt')).to.be.undefined
expect(list._isExcluded('/hello/world/i.js')).to.be.undefined
})

it('returns the first match if it finds one', () => {
list = new List([], ['*.js', '**/*.js'], emitter, preprocess)
expect(list._isExcluded('world.js')).to.be.eql('*.js')
expect(list._isExcluded('/hello/world/i.js')).to.be.eql('**/*.js')
})
})

describe('_isIncluded', () => {
beforeEach(() => {
preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()
})

it('returns undefined when no match is found', () => {
list = new List(patterns('*.js'), [], emitter, preprocess)
expect(list._isIncluded('hello.txt')).to.be.undefined
expect(list._isIncluded('/hello/world/i.js')).to.be.undefined
})

it('returns the first match if it finds one', () => {
list = new List(patterns('*.js', '**/*.js'), [], emitter, preprocess)
expect(list._isIncluded('world.js').pattern).to.be.eql('*.js')
expect(list._isIncluded('/hello/world/i.js').pattern).to.be.eql('**/*.js')
})
})

describe('_exists', () => {
beforeEach(() => {
patternList = _.cloneDeep(PATTERN_LIST)
mg = _.cloneDeep(MG)

preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()

glob = {
Glob: (pattern, opts) => ({
found: patternList[pattern],
statCache: mg.statCache
})
}

List = proxyquire('../../lib/file-list', {
helper: helper,
glob: glob,
fs: mockFs
})

list = new List(patterns('/some/*.js', '*.txt'), [], emitter, preprocess)

return list.refresh()
})

it('returns false when no match is found', () => {
expect(list._exists('/some/s.js')).to.be.false
expect(list._exists('/hello/world.ex')).to.be.false
})

it('returns true when a match is found', () => {
expect(list._exists('/some/a.js')).to.be.true
expect(list._exists('/some/b.js')).to.be.true
})
})

describe('refresh', () => {
beforeEach(() => {
patternList = _.cloneDeep(PATTERN_LIST)
mg = _.cloneDeep(MG)
preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()

glob = {
Glob: (pattern, opts) => ({
found: patternList[pattern],
statCache: mg.statCache
})
}

List = proxyquire('../../lib/file-list', {
helper: helper,
glob: glob,
fs: mockFs
})

list = new List(patterns('/some/*.js', '*.txt'), [], emitter, preprocess)
})

it('resolves patterns', () => {
return list.refresh().then(files => {
expect(list.buckets.size).to.equal(2)

var first = pathsFrom(list.buckets.get('/some/*.js'))
var second = pathsFrom(list.buckets.get('*.txt'))

expect(first).to.contain('/some/a.js', '/some/b.js')
expect(second).to.contain('/a.txt', '/b.txt', '/c.txt')
})
})

it('cancels refreshs', () => {
var checkResult = files => {
expect(_.pluck(files.served, 'path')).to.contain('/some/a.js', '/some/b.js', '/some/c.js')
}

var p1 = list.refresh().then(checkResult)
patternList['/some/*.js'].push('/some/c.js')
mg.statCache['/some/c.js'] = {mtime: new Date()}
var p2 = list.refresh().then(checkResult)

return Promise.all([p1, p2])
})

it('sets the mtime for all files', () => {
return list.refresh().then(files => {
var bucket = list.buckets.get('/some/*.js')

var file1 = findFile('/some/a.js', bucket)
var file2 = findFile('/some/b.js', bucket)

expect(file1.mtime).to.be.eql(mg.statCache['/some/a.js'].mtime)
expect(file2.mtime).to.be.eql(mg.statCache['/some/b.js'].mtime)
})
})

it('sets the mtime for relative patterns', () => {
list = new List(patterns('/some/world/../*.js', '*.txt'), [], emitter, preprocess)

return list.refresh().then(files => {
var bucket = list.buckets.get('/some/world/../*.js')

var file1 = findFile('/some/a.js', bucket)
var file2 = findFile('/some/b.js', bucket)

expect(file1.mtime).to.be.eql(mg.statCache['/some/a.js'].mtime)
expect(file2.mtime).to.be.eql(mg.statCache['/some/b.js'].mtime)
})
})

it('should sort files within buckets and keep order of patterns (buckets)', () => {



list = new List(patterns('/a.*', '/some/*.js', '*.txt'), ['**/b.js'], emitter, preprocess)

return list.refresh().then(files => {
expect(pathsFrom(files.served)).to.deep.equal([
'/a.txt',
'/some/a.js',
'/b.txt',
'/c.txt'
])
})
})

it('ingores excluded files', () => {
list = new List(patterns('*.txt'), ['/a.*', '**/b.txt'], emitter, preprocess)

return list.refresh().then(files => {
var bucket = pathsFrom(list.buckets.get('*.txt'))

expect(bucket).to.contain('/c.txt')
expect(bucket).not.to.contain('/a.txt')
expect(bucket).not.to.contain('/b.txt')
})
})

it('does not glob urls and sets the isUrl flag', () => {
list = new List(patterns('http://some.com'), [], emitter, preprocess)

return list.refresh()
.then(files => {
var bucket = list.buckets.get('http://some.com')
var file = findFile('http://some.com', bucket)

expect(file).to.have.property('isUrl', true)
}
)
})

it('preprocesses all files', () => {
return list.refresh().then(files => {
expect(preprocess.callCount).to.be.eql(5)
})
})

it('fails when a preprocessor fails', () => {
preprocess = sinon.spy((file, next) => {
next(new Error('failing'), null)
})

list = new List(patterns('/some/*.js'), [], emitter, preprocess)

return list.refresh().catch(err => {
expect(err.message).to.be.eql('failing')
})
})
})

describe('reload', () => {
beforeEach(() => {
preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()
list = new List(patterns('/some/*.js', '*.txt'), [], emitter, preprocess)
})

it('refreshes, even when a refresh is already happening', () => {
sinon.spy(list, '_refresh')

return Promise.all([
list.refresh(),
list.reload(patterns('*.txt'), [])
])
.then(() => {
expect(list._refresh).to.have.been.calledTwice
}
)
})
})

describe('addFile', () => {
beforeEach(() => {
patternList = PATTERN_LIST
mg = MG

preprocess = sinon.spy((file, done) => process.nextTick(done))
emitter = new EventEmitter()

glob = {
Glob: (pattern, opts) => ({
found: patternList[pattern],
statCache: mg.statCache
})
}
List = proxyquire('../../lib/file-list', {
helper: helper,
glob: glob,
fs: mockFs
})

list = new List(patterns('/some/*.js', '*.txt'), ['/secret/*.txt'], emitter, preprocess)
})

it('does not add excluded files', () => {
return list.refresh().then(before => {
return list.addFile('/secret/hello.txt').then(files => {
expect(files.served).to.be.eql(before.served)
})
})
})

it('does not add already existing files', () => {
return list.refresh().then(before => {
return list.addFile('/some/a.js').then(files => {
expect(files.served).to.be.eql(before.served)
})
})
})

it('does not add unmatching files', () => {
return list.refresh().then(before => {
return list.addFile('/some/a.ex').then(files => {
expect(files.served).to.be.eql(before.served)
})
})
})

it('adds the file to the correct bucket', () => {
return list.refresh().then(before => {
return list.addFile('/some/d.js').then(files => {
expect(pathsFrom(files.served)).to.contain('/some/d.js')
var bucket = list.buckets.get('/some/*.js')
expect(pathsFrom(bucket)).to.contain('/some/d.js')
})
})
})

it('fires "file_list_modified"', () => {
var modified = sinon.stub()
emitter.on('file_list_modified', modified)

return list.refresh().then(() => {
modified.reset()

return list.addFile('/some/d.js').then(() => {
expect(modified).to.have.been.calledOnce
})
})
})

