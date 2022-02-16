'use strict';

const assert = require('assert');
const start = require('../common');



describe('Lean Tutorial', function() {
let MyModel;
const mongoose = new start.mongoose.Mongoose();

before(function() {
const schema = new mongoose.Schema({ name: String });
MyModel = mongoose.model('Test1', schema);

return mongoose.connect('mongodb://localhost:27017/mongoose', {
useNewUrlParser: true
});
});

beforeEach(function() {
mongoose.deleteModel(/Person/);
mongoose.deleteModel(/Group/);
});

it('compare sizes lean vs not lean', async function() {
const schema = new mongoose.Schema({ name: String });
const MyModel = mongoose.model('Test', schema);

await MyModel.create({ name: 'test' });


const sizeof = require('object-sizeof');

const normalDoc = await MyModel.findOne();

const leanDoc = await MyModel.findOne().lean();

sizeof(normalDoc);
sizeof(leanDoc);




JSON.stringify(normalDoc).length === JSON.stringify(leanDoc.length);

assert.ok(sizeof(normalDoc) >= 1000);
assert.equal(sizeof(leanDoc), 86);
assert.equal(JSON.stringify(normalDoc).length, JSON.stringify(leanDoc).length);

});

it('compare types', async function() {

await MyModel.create({ name: 'test' });

const normalDoc = await MyModel.findOne();
const leanDoc = await MyModel.findOne().lean();

normalDoc instanceof mongoose.Document;
normalDoc.constructor.name;

leanDoc instanceof mongoose.Document;
leanDoc.constructor.name;

assert.ok(normalDoc instanceof mongoose.Document);
assert.equal(normalDoc.constructor.name, 'model');
assert.ok(!(leanDoc instanceof mongoose.Document));
assert.equal(leanDoc.constructor.name, 'Object');

});

it('getters and virtuals', async function() {


const personSchema = new mongoose.Schema({
firstName: {
type: String,
get: capitalizeFirstLetter
},
lastName: {
type: String,
get: capitalizeFirstLetter
}
});
personSchema.virtual('fullName').get(function() {
return `${this.firstName} ${this.lastName}`;
});
function capitalizeFirstLetter(v) {

return v.charAt(0).toUpperCase() + v.substr(1);
}
const Person = mongoose.model('Person', personSchema);

await Person.deleteMany({});



await Person.create({ firstName: 'benjamin', lastName: 'sisko' });
const normalDoc = await Person.findOne();
const leanDoc = await Person.findOne().lean();

normalDoc.fullName;
normalDoc.firstName;
normalDoc.lastName;

leanDoc.fullName;
leanDoc.firstName;
leanDoc.lastName;

assert.equal(normalDoc.fullName, 'Benjamin Sisko');
assert.equal(normalDoc.firstName, 'Benjamin');
assert.equal(normalDoc.lastName, 'Sisko');
assert.equal(leanDoc.fullName, void 0);
assert.equal(leanDoc.firstName, 'benjamin');
assert.equal(leanDoc.lastName, 'sisko');

});

it('conventional populate', async function() {

const Group = mongoose.model('Group', new mongoose.Schema({
name: String,
members: [{ type: mongoose.ObjectId, ref: 'Person' }]
}));
const Person = mongoose.model('Person', new mongoose.Schema({
name: String
}));

await Group.deleteMany({});
await Person.deleteMany({});



const people = await Person.create([
{ name: 'Benjamin Sisko' },
{ name: 'Kira Nerys' }
]);
await Group.create({
name: 'Star Trek: Deep Space Nine Characters',
members: people.map(p => p._id)
});


const group = await Group.findOne().lean().populate('members');
group.members[0].name;
group.members[1].name;


group instanceof mongoose.Document;
group.members[0] instanceof mongoose.Document;
group.members[1] instanceof mongoose.Document;

assert.equal(group.members[0].name, 'Benjamin Sisko');
assert.equal(group.members[1].name, 'Kira Nerys');

});

it('virtual populate', async function() {

const groupSchema = new mongoose.Schema({ name: String });
groupSchema.virtual('members', {
ref: 'Person',
localField: '_id',
foreignField: 'groupId'
});
const Group = mongoose.model('Group', groupSchema);
const Person = mongoose.model('Person', new mongoose.Schema({
name: String,
groupId: mongoose.ObjectId
}));

await Group.deleteMany({});
await Person.deleteMany({});



const g = await Group.create({ name: 'DS9 Characters' });
const people = await Person.create([
{ name: 'Benjamin Sisko', groupId: g._id },
{ name: 'Kira Nerys', groupId: g._id }
]);


const group = await Group.findOne().lean().populate({
path: 'members',
sort: { name: 1 }
});
group.members[0].name;
group.members[1].name;


group instanceof mongoose.Document;
group.members[0] instanceof mongoose.Document;
group.members[1] instanceof mongoose.Document;

assert.equal(group.members[0].name, 'Benjamin Sisko');
assert.equal(group.members[1].name, 'Kira Nerys');

});
});
