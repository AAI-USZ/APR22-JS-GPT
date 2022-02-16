$(keys).reduce(queryString.parseQuery(key), function(parts, key, i){
if (key in params)
params[key] instanceof Array ?
