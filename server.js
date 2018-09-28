// Modules
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
const http = require('http')
const path = require('path')

// Set server port
const port = 8282

// Create server
const server = http.createServer(app).listen(port)
console.log('Server running on http://localhost:' + port)

// Require and configure socket.io
const io = require('socket.io')(server)
app.use(morgan('dev'))
app.use(helmet())

app.get('/favicon.ico', function (req, res) {
  res.sendStatus(200)
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

// Serve up static assests
app.use(express.static(path.join(__dirname, 'public')))

// IO
require('./app/io')(io)

// Expose app
exports = module.exports = app
