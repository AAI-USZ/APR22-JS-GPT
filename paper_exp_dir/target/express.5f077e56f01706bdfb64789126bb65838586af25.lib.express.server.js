this.set('env', process.env.NODE_ENV || 'development');
this.use(function(req, res, next){
req.query = {};
