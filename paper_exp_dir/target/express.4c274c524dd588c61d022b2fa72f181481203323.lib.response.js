options = options || {};
if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
var cookie = utils.serializeCookie(name, val, options);
