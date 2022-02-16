
var app = require('../../examples/multipart/app')
, request = require('../support/http')
, path = 'test/acceptance/fixtures/grey.png'
, fs = require('fs')

var logo = fs.readFileSync(path)
, boundary = '------expressmultipart';

describe('multipart', function(){
