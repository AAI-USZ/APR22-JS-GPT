
var express = require('../')
, Router = express.Router
, request = require('./support/http')
, assert = require('assert');

describe('Router', function(){
var router, app;

beforeEach(function(){
router = new Router;
app = express();
})
