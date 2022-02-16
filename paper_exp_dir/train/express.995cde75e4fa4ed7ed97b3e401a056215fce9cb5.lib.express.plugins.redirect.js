




Request.include({



redirect: function(uri) {
if (uri == 'back' || uri == 'home') uri = this[uri]
this.header('location', uri)
this.halt(302)
}
})
