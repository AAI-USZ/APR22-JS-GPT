


describe('My Sample App', function() {

iit('should let Angular do its work', function() {
browser().navigateTo('/index.html');
input('yourName').enter('A Pirate!');
expect(element('.ng-binding').text()).toEqual('Hello A Pirate!!');
});

