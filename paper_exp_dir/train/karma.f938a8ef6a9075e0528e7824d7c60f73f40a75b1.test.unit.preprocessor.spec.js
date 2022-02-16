import mocks from 'mocks'
import di from 'di'

describe('preprocessor', () => {
var pp
var m
var mockFs


var binarydata = new Buffer([0x25, 0x50, 0x44, 0x66, 0x46, 0x00])

beforeEach(() => {
mockFs = mocks.fs.create({
some: {
'a.js': mocks.fs.file(0, 'content'),
'b.js': mocks.fs.file(0, 'content'),
'a.txt': mocks.fs.file(0, 'some-text'),
'photo.png': mocks.fs.file(0, binarydata),
