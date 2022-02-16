


Express.Cookie = {
name : 'cookie',

settings : {
maxAge : 3600
},

utilities : {



cookie : function(key, value) {
return value ? Express.response.cookie[key] = value :
Express.response.cookie[key]
}
},

onRequest : {
'parse cookie' : function() {
Express.response.cookie =
Express.request.cookie =
Express.parseCookie(Express.requestHeader('Cookie'));
}
},

onResponse : {
'set cookie' : function() {
var cookie = []
for (var key in Express.response.cookie)
if (Express.response.cookie.hasOwnProperty(key))
cookie.push(key + '=' + Express.response.cookie[key])
if (cookie.length)
Express.header('Set-Cookie', cookie.join('; '))
}
}

}
