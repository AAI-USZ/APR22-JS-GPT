




;(function(){
var global = this, initialize = true
var referencesSuper = /xyz/.test(function(){ xyz }) ? /\b__super__\b/ : /.*/



Class = function(props){
if (this == global)
return Class.extend(props)
}



Class.version = '1.2.0'



Class.extend = function(props) {
var __super__ = this.prototype

initialize = false
var prototype = new this
initialize = true

function Class() {
if (initialize && this.init)
this.init.apply(this, arguments)
}

function extend(props) {
for (var key in props)
if (props.hasOwnProperty(key))
Class[key] = props[key]
}

Class.include = function(props) {
for (var name in props)
if (name == 'include')
