




var libxml = require('support/libxmljs')



ElementCollection = Collection.extend({



init: function(markup) {
if (typeof markup != 'string')
return this.__super__(markup)
if (!(/<html>/.test(markup)))
markup = '<html><body>' + markup + '</body></html>'
this.document = libxml.parseString(markup)
this.arr = [this.document.root()]
},



name: function() {
return this.at(0).name()
},



xpath: function(xpath) {

return $(this.reduce([], function(array, e){
$(e.find(xpath)).each(function(child){
array.push(child)
})
return array
}))
},

children: function() {

return $(this.reduce([], function(array, e){
$(e.children()).each(function(child){
array.push(child)
})
return array
}))
},

parents: function() {
return this.map(function(e){
return e.parent()
})
},

parent: function() {
return $([this.at(0).parent()])
},



toString: function() {
if (this.at(0) && this.at(0).doc)
return '[Collection <elements>]'
return this.__super__()
