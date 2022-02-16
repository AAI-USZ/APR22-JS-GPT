
use({
name : 'foo',
init : function() {
initCalled = true
},

settings : {
one : 1,
two : 2
},

utilities : {
foo : function(){
return 'bar'
}
},

