function cacheViewSync(path) {
return viewCache[path] = fs.readFileSync(path, 'utf8');
}
