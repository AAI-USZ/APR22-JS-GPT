if (set('cache static files') && (cache = request.cache.get(file)))
return request.contentType(cache.type),
request.halt(200, cache.content, 'binary')
