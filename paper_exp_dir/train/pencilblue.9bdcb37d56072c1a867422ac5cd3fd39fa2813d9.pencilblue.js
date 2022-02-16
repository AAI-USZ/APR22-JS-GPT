
global.pb = require('./include/requirements');


var init = function(){


initDBConnections();


initServer();


registerSystemForEvents();
};


function initDBConnections(){

pb.dbm.getDB(pb.config.db.name).then(function(result){
if (typeof result !== 'Error') {
log.debug('Established connection to DB: ' + result.databaseName);
mongoDB = result;
}
else {
throw err;
}
});
}


var server;
function initServer(){
log.debug('Starting server...');
pb.server = http.createServer(function(request, response){


var route = new Route(request, response);

if(request.headers.cookie)
{
var parsedCookies = {};
var cookieParameters = request.headers.cookie.split(';');
for(var i = 0; i < cookieParameters.length; i++)
{
var cookieParameter = cookieParameters[i].split('=');
parsedCookies[cookieParameter[0]] = cookieParameter[1];
}
request.headers['parsed_cookies'] = parsedCookies;
}

if(request.headers['content-type'])
{
if(request.headers['content-type'].indexOf('multipart/form-data') > -1)
{
return;
}
}

request.on('data', function(chunk)
{
if(typeof request.headers['post'] == 'undefined')
{
request.headers['post'] = '';
}
request.headers['post'] += chunk;
});
});

pb.server.listen(pb.config.sitePort, pb.config.siteIP);
log.info(pb.config.siteName + ' running on ' + pb.config.siteRoot);
}


function registerSystemForEvents(){


process.openStdin();
process.on('SIGINT', function () {
log.info('Shutting down...');
pb.dbm.shutdown();
});
}







init();

