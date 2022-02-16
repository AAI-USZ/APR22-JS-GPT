var should = require('chai').should();
var Promise = require('bluebird');
var Readable = require('stream').Readable;
var pathFn = require('path');
var crypto = require('crypto');
var fs = require('hexo-fs');
var testUtil = require('../../util');

describe('Router', function(){
var Router = require('../../../lib/hexo/router');
var router = new Router();

function checkStream(stream, expected){
