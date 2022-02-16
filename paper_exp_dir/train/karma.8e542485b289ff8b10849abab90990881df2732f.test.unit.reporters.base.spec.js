'use strict'

describe('reporter', () => {
const BaseReporter = require('../../../lib/reporters/base')

describe('Progress', () => {
let reporter
let adapter = reporter = null

beforeEach(() => {
adapter = sinon.spy()
