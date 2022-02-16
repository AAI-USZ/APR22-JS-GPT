
var express = require('../');

describe('config', function(){
describe('.configure()', function(){
describe('when no env is given', function(){
it('should always execute', function(){
var app = express();
var calls = [];

app.configure(function(){
calls.push('all');
});

app.configure('test', function(){
calls.push('test');
});

app.configure('test', function(){
calls.push('test 2');
});

calls.should.eql(['all', 'test', 'test 2'])
})
})

describe('when an env is given', function(){
it('should only execute the matching env', function(){
var app = express();
var calls = [];

app.set('env', 'development');

app.configure('development', function(){
calls.push('dev');
});

app.configure('test', function(){
calls.push('test');
});

calls.should.eql(['dev']);
})
})

describe('when several envs are given', function(){
it('should execute when matching one', function(){
var app = express();
var calls = [];

app.set('env', 'development');

app.configure('development', function(){
calls.push('dev');
