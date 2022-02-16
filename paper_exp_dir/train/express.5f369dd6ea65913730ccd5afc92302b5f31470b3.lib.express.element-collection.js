




var libxml = require('support/libxmljs')



ElementCollection = Collection.extend({



init: function(markup) {
if (!(/<html>/.test(markup)))
markup = '<html><body>' + markup + '</body></html>'
this.document = libxml.parseString(markup)
this.arr = [this.document.root()]
},



name: function() {
return this.at(0).name()
},



toString: function() {
return '[ElementCollection ' + this.arr + ']'
}
})

