'use strict'

const mocks = require('mocks')
const di = require('di')
const path = require('path')

const events = require('../../lib/events')

describe('preprocessor', () => {
let pp
let m
let mockFs
let emitterSetting

const binarydata = new Buffer([0x25, 0x50, 0x44, 0x66, 0x46, 0x00])

beforeEach(() => {
mockFs = mocks.fs.create({
some: {
'a.js': mocks.fs.file(0, 'content'),
'b.js': mocks.fs.file(0, 'content'),
'a.txt': mocks.fs.file(0, 'some-text'),
'photo.png': mocks.fs.file(0, binarydata),
'CAM_PHOTO.JPG': mocks.fs.file(0, binarydata),
'.dir': {
'a.js': mocks.fs.file(0, 'content')
}
}
})

const mocks_ = {
'graceful-fs': mockFs,
minimatch: require('minimatch')
}
emitterSetting = { 'emitter': ['value', new events.EventEmitter()] }
m = mocks.loadFile(path.join(__dirname, '/../../lib/preprocessor.js'), mocks_)
})

it('should preprocess matching file', (done) => {
const fakePreprocessor = sinon.spy((content, file, done) => {
file.path = file.path + '-preprocessed'
done(null, 'new-content')
})

const injector = new di.Injector([{
'preprocessor:fake': [
'factory', function () { return fakePreprocessor }
]
}, emitterSetting])
pp = m.createPreprocessor({ '**/*.js': ['fake'] }, null, injector)

const file = { originalPath: '/some/a.js', path: 'path' }

pp(file, () => {
expect(fakePreprocessor).to.have.been.called
expect(file.path).to.equal('path-preprocessed')
expect(file.content).to.equal('new-content')
done()
})
})

it('should match directories starting with a dot', (done) => {
const fakePreprocessor = sinon.spy((content, file, done) => {
file.path = file.path + '-preprocessed'
done(null, 'new-content')
})

const injector = new di.Injector([{
'preprocessor:fake': ['factory', function () { return fakePreprocessor }]
}, emitterSetting])
pp = m.createPreprocessor({ '**/*.js': ['fake'] }, null, injector)

const file = { originalPath: '/some/.dir/a.js', path: 'path' }

pp(file, () => {
expect(fakePreprocessor).to.have.been.called
expect(file.path).to.equal('path-preprocessed')
expect(file.content).to.equal('new-content')
done()
})
})

it('should check patterns after creation when invoked', (done) => {
const fakePreprocessor = sinon.spy((content, file, done) => {
file.path = file.path + '-preprocessed'
done(null, 'new-content')
})

const injector = new di.Injector([{
'preprocessor:fake': ['factory', function () { return fakePreprocessor }]
}, emitterSetting])
const config = { '**/*.txt': ['fake'] }
pp = m.createPreprocessor(config, null, injector)

const file = { originalPath: '/some/a.js', path: 'path' }

config['**/*.js'] = ['fake']

pp(file, () => {
expect(fakePreprocessor).to.have.been.called
expect(file.path).to.equal('path-preprocessed')
expect(file.content).to.equal('new-content')
done()
})
})

it('should ignore not matching file', (done) => {
const fakePreprocessor = sinon.spy((content, file, done) => {
done(null, '')
})

const injector = new di.Injector([{
'preprocessor:fake': ['factory', function () { return fakePreprocessor }]
}, emitterSetting])
pp = m.createPreprocessor({ '**/*.js': ['fake'] }, null, injector)

const file = { originalPath: '/some/a.txt', path: 'path' }

pp(file, () => {
expect(fakePreprocessor).to.not.have.been.called
done()
})
})

it('should apply all preprocessors', (done) => {
const fakePreprocessor1 = sinon.spy((content, file, done) => {
file.path = file.path + '-p1'
done(null, content + '-c1')
})

const fakePreprocessor2 = sinon.spy((content, file, done) => {
file.path = file.path + '-p2'
done(content + '-c2')
})

const injector = new di.Injector([{
'preprocessor:fake1': ['factory', function () { return fakePreprocessor1 }],
'preprocessor:fake2': ['factory', function () { return fakePreprocessor2 }]
}, emitterSetting])

pp = m.createPreprocessor({ '**/*.js': ['fake1', 'fake2'] }, null, injector)
