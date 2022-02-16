
var express = require('../')
, Router = express.Router
, request = require('./support/http')
, methods = require('methods')
, assert = require('assert');

describe('Router', function(){
var router, app;

beforeEach(function(){
router = new Router;
app = express();
})
