'use strict'

const path = require('path')
const proxyquire = require('proxyquire')
const createInstantiatePlugin = require('../../lib/plugin').createInstantiatePlugin

describe('plugin', () => {
describe('createInstantiatePlugin', () => {
it('creates the instantiatePlugin function', () => {
const fakeGet = sinon.stub()
const fakeInjector = { get: fakeGet }

