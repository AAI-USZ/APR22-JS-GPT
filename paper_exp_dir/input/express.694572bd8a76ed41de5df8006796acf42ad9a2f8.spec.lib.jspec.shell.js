


;(function(){

var _quit = quit

Shell = {



main: this,



commands: {
quit: ['Terminate the shell', function(){ _quit() }],
