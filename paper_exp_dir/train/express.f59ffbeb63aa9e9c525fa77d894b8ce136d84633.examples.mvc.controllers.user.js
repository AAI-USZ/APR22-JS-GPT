


var users = [
{ id: 0, name: 'TJ', email: 'tj@vision-media.ca' },
{ id: 1, name: 'Simon', email: 'simon@vision-media.ca' }
];

function get(id, fn) {
if (users[id]) {
fn(null, users[id]);
} else {
fn(new Error('User ' + id + ' does not exist'));
}
}

module.exports = {
