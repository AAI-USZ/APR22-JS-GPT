
(function(){
Express = {
version : '0.0.1',



start : function(port) {
this.server.listen(port || 3000, function(request, response){
response.sendHeader(200, [['Content-Type', 'text/plain']])
response.sendBody('Testing')
response.finish()
})
