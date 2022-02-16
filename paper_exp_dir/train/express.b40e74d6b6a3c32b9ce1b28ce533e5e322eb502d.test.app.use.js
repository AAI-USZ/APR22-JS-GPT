
var assert = require('assert');
var express = require('..');
var request = require('supertest');

describe('app', function(){
it('should emit "mount" when mounted', function(done){
var blog = express()
, app = express();

blog.on('mount', function(arg){
