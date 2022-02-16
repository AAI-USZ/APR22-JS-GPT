

var https = require('https');
var path = require('path');
var extname = path.extname;



module.exports = GithubView;



function GithubView(name, options){
this.name = name;
options = options || {};
this.engine = options.engines[extname(name)];


this.path = '/' + options.root + '/master/' + name;
}



GithubView.prototype.render = function(options, fn){
var self = this;
var opts = {
host: 'raw.githubusercontent.com',
port: 443,
path: this.path,
method: 'GET'
};

https.request(opts, function(res) {
var buf = '';
res.setEncoding('utf8');
res.on('data', function(str){ buf += str });
res.on('end', function(){
self.engine(buf, options, fn);
});
}).end();
};
