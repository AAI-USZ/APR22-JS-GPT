var middleware = require('./middlewares');

module.exports = function(app){
app.get('login', 'sessions#new');
app.post('login', 'sessions#create');
app.del('logout', 'sessions#destroy');

app.namespace('/', middleware.session, function(app){
app.get('templates/*', function(req, res, next){
res.render(req.params[0]);
});

app.namespace('api', function(api){
api.get('/', 'home#index');

api.resource('posts', {exclude: ['new', 'edit']});

api.namespace('files', function(file){
file.get('*', 'files#index');
file.post('*', 'files#create');
file.put('*', 'files#update');
file.del('*', 'files#destroy');
});
