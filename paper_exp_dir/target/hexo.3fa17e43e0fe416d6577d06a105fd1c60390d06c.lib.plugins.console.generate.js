var dest = pathFn.join(publicDir, path);
return fs.exists(dest).then(function(exist){
if (exist && !route.isModified(path)) return false;
