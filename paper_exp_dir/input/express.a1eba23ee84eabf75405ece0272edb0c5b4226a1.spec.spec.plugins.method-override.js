
describe 'Express'
before_each
reset()
use(require('express/plugins/method-override').MethodOverride)
end

describe 'MethodOverride'
describe 'on'
describe 'request'
it 'should consider _method as the HTTP method'
put('/user', function(){
return 'updated user'
})
end

it 'should force _method to lowercase to conform to internal uses'
put('/user', function(){
return 'updated user'
})
end
end
end
end
end
