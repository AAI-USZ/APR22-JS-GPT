import {loadFile} from 'mocks'
import constant from '../../lib/constants'
import path from 'path'

describe('runner', () => {
var m

beforeEach(() => {
m = loadFile(path.join(__dirname, '/../../lib/runner.js'))
})

describe('parseExitCode', () => {
