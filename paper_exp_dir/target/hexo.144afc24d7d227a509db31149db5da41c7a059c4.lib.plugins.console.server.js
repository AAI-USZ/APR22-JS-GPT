if (!target){
if (uri.substr(uri.length - 1, 1) === '/') return next();
res.redirect(req.url + '/');
