var expect = require('expect.js');
var lang = require('mout/lang');
var object = require('mout/object');
var endpointParser = require('../');

describe('endpoint-parser', function() {
describe('.decompose', function() {
it('should decompose endpoints correctly', function() {
var suite = {
'jquery#~2.0.0': {
name: '',
source: 'jquery',
target: '~2.0.0'
},
'jquery#*': { name: '', source: 'jquery', target: '*' },
'jquery#latest': { name: '', source: 'jquery', target: '*' },
