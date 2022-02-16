


var express = require('../../')
, app = module.exports = express()
, test = app.get('env') == 'test';

if (!test) app.use(express.logger('dev'));
app.use(app.router);





app.use(error);







function error(err, req, res, next) {

if (!test) console.error(err.stack);


res.send(500);
}

app.get('/', function(req, res){

throw new Error('something broke!');
});

app.get('/next', function(req, res, next){

process.nextTick(function(){
next(new Error('oh no!'));
});
});


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
