
var after = require('after');
var assert = require('assert');
var express = require('..');
var request = require('supertest');

describe('res', function(){
describe('.download(path)', function(){
it('should transfer as an attachment', function(done){
var app = express();

