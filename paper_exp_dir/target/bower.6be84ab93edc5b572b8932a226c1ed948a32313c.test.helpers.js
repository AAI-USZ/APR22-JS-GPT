emitter.once(eventName, function (payload) {
deferred.resolve(payload);
emitter.once('error', function (reason) {
