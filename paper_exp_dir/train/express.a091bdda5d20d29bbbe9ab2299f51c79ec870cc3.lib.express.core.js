
(function(){
Express = {
version : '0.0.1',
response : {
body : null,
status : 200,
headers : {},
statuses : {
'ok'                 : 200,
'created'            : 201,
'accepted'           : 202,
'no content'         : 204,
'reset content'      : 205,
'partial content'    : 206,
'moved permanently'  : 301,
'found'              : 302,
'see other'          : 303,
'not modified'       : 304,
'use proxy'          : 305,
'switch proxy'       : 306,
'temporary redirect' : 307,
'bad request'        : 400,
'unauthorized'       : 401,
'forbidden'          : 403,
'not found'          : 404
}
},



start : function(port) {
this.server.listen(port || 3000, function(request, response){
Express.callRouteFor(request)
response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
response.sendBody(Express.response.body || '')
response.finish()
})
},

server : {



listen : function(port, callback) {
