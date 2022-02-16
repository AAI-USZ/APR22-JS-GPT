'use strict'

const net = require('net')

const NetUtils = {
bindAvailablePort (port, listenAddress) {
return new Promise((resolve, reject) => {
const server = net.createServer()

server
.on('error', (err) => {
server.close()
