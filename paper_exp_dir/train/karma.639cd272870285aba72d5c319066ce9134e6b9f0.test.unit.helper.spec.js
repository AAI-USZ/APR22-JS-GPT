'use strict'

const path = require('path')

describe('helper', () => {
const helper = require('../../lib/helper')

describe('browserFullNameToShort', () => {

const expecting = (name) => expect(helper.browserFullNameToShort(name))

it('should parse iOS', () => {
expecting(
