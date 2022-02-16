var middlewares = require('./middlewares');

module.exports = function(app){
app.get('login', 'sessions#new');
app.post('login', 'sessions#create');
app.del('logout', 'sessions#destroy');

app.namespace('/', middlewares.sessions, function(app){
app.get('templates/*', function(req, res, next){
res.render(req.params[0]);
});

app.namespace('api', function(api){
api.get('/', 'home#index');

api.resource('posts', {exclude: ['new', 'edit']});

api.namespace('files', middlewares.files, function(file){
file.get('list/*', 'files#list');
file.get('show/*', 'files#show');
file.get('download/*', 'files#download');
file.post('newfolder/*', 'files#newFolder');
file.post('upload/*', 'files#upload');
file.put('*', 'files#update');
file.del('*', 'files#destroy');
});
});

