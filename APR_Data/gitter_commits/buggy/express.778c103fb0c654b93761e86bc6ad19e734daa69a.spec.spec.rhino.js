
load('/Library/Ruby/Gems/1.8/gems/visionmedia-jspec-2.3.1/lib/jspec.js')
load('lib/express.core.js')

JSpec
.exec('spec/spec.core.js')
.exec('spec/spec.routing.js')
.run({ formatter : JSpec.formatters.Terminal })
.report()