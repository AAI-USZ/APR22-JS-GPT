
// Express - BodyDecoder - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

exports.BodyDecoder = Plugin.extend({
  on: {
    request: function(event) {
      var request = event.request
      request.uri.post = 
        request.header('content-type') && 
        request.header('content-type').indexOf('application/x-www-form-urlencoded') > -1 ?
          parseParams(request.body) :
            {}
    }
  }
})