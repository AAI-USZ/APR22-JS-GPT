

var express = require('../../');
var logger = require('morgan');
var app = module.exports = express();
var test = app.get('env') === 'test'

if (!test) app.use(logger('dev'));







function error(err, req, res, next) {

if (!test) console.error(err.stack);


res.status(500);
res.send('Internal Server Error');
}

app.get('/', function(req, res){

throw new Error('something broke!');
});

app.get('/next', function(req, res, next){




process.nextTick(function(){
next(new Error('oh no!'));
});
});




app.use(error);


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
}
