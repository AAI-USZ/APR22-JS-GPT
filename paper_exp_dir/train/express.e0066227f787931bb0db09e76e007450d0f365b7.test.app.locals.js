
var express = require('../')

describe('app', function(){
describe('.locals(obj)', function(){
it('should merge locals', function(){
var app = express();
Object.keys(app.locals).should.eql(['settings']);
app.locals.user = 'tobi';
app.locals.age = 2;
Object.keys(app.locals).should.eql(['settings', 'user', 'age']);
app.locals.user.should.equal('tobi');
