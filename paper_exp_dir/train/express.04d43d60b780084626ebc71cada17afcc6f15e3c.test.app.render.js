
var express = require('../');

describe('app', function(){
describe('.render(name, fn)', function(){
it('should support absolute paths', function(done){
var app = express();

app.locals.user = { name: 'tobi' };

app.render(__dirname + '/fixtures/user.jade', function(err, str){
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should support absolute paths with "view engine"', function(done){
var app = express();

app.set('view engine', 'jade');
app.locals.user = { name: 'tobi' };

app.render(__dirname + '/fixtures/user', function(err, str){
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should expose app.locals', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.locals.user = { name: 'tobi' };

app.render('user.jade', function(err, str){
if (err) return done(err);
str.should.equal('<p>tobi</p>');
done();
})
})

it('should support index.<engine>', function(done){
var app = express();

app.set('views', __dirname + '/fixtures');
app.set('view engine', 'jade');

app.render('blog/post', function(err, str){
if (err) return done(err);
str.should.equal('<h1>blog post</h1>');
done();
})
})

describe('when the file does not exist', function(){
it('should provide a helpful error', function(done){
var app = express();
app.set('views', __dirname + '/fixtures');
app.render('rawr.jade', function(err){
err.message.should.equal('Failed to lookup view "rawr.jade"');
done();
});
})
})

