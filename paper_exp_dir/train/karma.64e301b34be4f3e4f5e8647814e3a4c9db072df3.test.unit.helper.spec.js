import path from 'path'

describe('helper', () => {
var helper = require('../../lib/helper')

describe('browserFullNameToShort', () => {

var expecting = (name) => expect(helper.browserFullNameToShort(name))

it('should parse iOS', () => {
expecting(
'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 ' +
