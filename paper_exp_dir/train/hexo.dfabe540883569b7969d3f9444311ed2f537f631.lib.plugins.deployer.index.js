var deployer = hexo.extend.deployer;

deployer.register('github', require('./github'));
deployer.register('heroku', require('./heroku'));
deployer.register('openshift', require('./openshift'));
