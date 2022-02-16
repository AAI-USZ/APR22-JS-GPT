import mocks from 'mocks'
import di from 'di'

describe('preprocessor', () => {
var pp
var m
var mockFs

beforeEach(() => {
mockFs = mocks.fs.create({
some: {
'a.js': mocks.fs.file(0, 'content'),
'b.js': mocks.fs.file(0, 'content'),
'a.txt': mocks.fs.file(0, 'some-text'),
'photo.png': mocks.fs.file(0, 'binary'),
'CAM_PHOTO.JPG': mocks.fs.file(0, 'binary'),
'.dir': {
'a.js': mocks.fs.file(0, 'content')
}
}
})

var mocks_ = {
'graceful-fs': mockFs,
minimatch: require('minimatch')
