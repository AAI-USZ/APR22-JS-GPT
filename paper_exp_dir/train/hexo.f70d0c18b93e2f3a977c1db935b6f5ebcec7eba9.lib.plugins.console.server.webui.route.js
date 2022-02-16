var middleware = require('./middleware');

module.exports = function(app){
app.get('login', 'sessions#new');
app.post('login', 'sessions#create');
app.del('logout', 'sessions#destroy');

app.namespace('/', middleware.session, function(app){
app.get('/', 'home#index');

app.resource('posts');
