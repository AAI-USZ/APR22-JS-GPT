import {loadFile} from 'mocks'
import path from 'path'

describe('logger', () => {
var m

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/logger.js'))
})

describe('setup', () => {
