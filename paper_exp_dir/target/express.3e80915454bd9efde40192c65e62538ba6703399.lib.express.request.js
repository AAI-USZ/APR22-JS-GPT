var callNextPlugin= function(error) {
if( error || pluginsExecuted >= totalPlugins ) callback(error);
else {
