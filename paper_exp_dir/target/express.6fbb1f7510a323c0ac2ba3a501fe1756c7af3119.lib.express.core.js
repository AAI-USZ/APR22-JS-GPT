this.request.uri.params[route.keys[i]] = Express.captures[i+1] || null
get ('/user/:name/:op', function(){
return param('op') + ' user "' + (param('name') || 'none') + '"'
