this.enable('x-powered-by');
this.set('env', process.env.NODE_ENV || 'development');
debug('booting in %s mode', this.get('env'));
