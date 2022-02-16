process.stdout = new EventEmitter()
process.stderr = new EventEmitter()
process.kill = sinon.spy()
