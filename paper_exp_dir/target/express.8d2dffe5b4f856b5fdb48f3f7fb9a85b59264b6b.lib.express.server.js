var fn = router(function(app){ self.routes = app; });
this.__defineGetter__('router', function(){
this.__usedRouter = true;
