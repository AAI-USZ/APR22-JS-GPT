


(function(){



function mockRequest(request) {
var mock = {
listeners : [],
method : 'GET',
headers : [],
uri : {
path : '/',
params : {}
},
setBodyEncoding : function(type) {
this.bodyEncoding = type
},
