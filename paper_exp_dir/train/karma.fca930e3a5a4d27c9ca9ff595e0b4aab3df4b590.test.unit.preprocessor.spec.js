import mocks from 'mocks'
import di from 'di'
import path from 'path'
import events from '../../lib/events'

describe('preprocessor', () => {
var pp
var m
var mockFs
var emitterSetting

var binarydata = new Buffer([0x25, 0x50, 0x44, 0x66, 0x46, 0x00])

