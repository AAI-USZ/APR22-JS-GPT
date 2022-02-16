


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
addListener : function(event, callback) {
this.listeners.push({ event : event, callback : callback })
