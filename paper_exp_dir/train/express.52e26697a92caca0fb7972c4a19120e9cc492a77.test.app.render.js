
var express = require('../');

describe('app', function(){
describe('.render(name, fn)', function(){
it('should expose app.locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

