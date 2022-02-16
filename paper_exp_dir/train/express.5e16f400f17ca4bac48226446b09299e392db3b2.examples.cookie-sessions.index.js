

var cookieSession = require('cookie-session');
var express = require('../../');

var app = module.exports = express();


app.use(cookieSession({ secret: 'manny is cool' }));


app.use(count);


function count(req, res) {
req.session.count = (req.session.count || 0) + 1
res.send('viewed ' + req.session.count + ' times\n')
}


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
}
