var createWebServer = function(injector, emitter) {
emitter.on('file_list_modified', function(files) {
filesPromise.set(files);
