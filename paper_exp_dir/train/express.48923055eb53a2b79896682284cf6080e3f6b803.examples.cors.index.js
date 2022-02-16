


var express = require('../..')
, app = express()
, api = express();



app.use(express.static(__dirname + '/public'));



api.use(express.logger('dev'));
api.use(express.bodyParser());



api.all('*', function(req, res, next){

res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
res.set('Access-Control-Allow-Methods', 'GET, POST');
res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

next();
});



api.post('/user', function(req, res){
console.log(req.body);
res.send(201);
});

app.listen(3000);
api.listen(3001);

console.log('app listening on 3000');
console.log('api listening on 3001');
