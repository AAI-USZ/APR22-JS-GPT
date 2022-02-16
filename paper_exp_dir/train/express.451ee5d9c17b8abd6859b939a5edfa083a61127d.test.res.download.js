
var after = require('after');
var assert = require('assert');
var Buffer = require('safe-buffer').Buffer
var express = require('..');
var request = require('supertest');

describe('res', function(){
describe('.download(path)', function(){
it('should transfer as an attachment', function(done){
var app = express();

app.use(function(req, res){
