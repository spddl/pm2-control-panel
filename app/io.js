const pm2 = require('pm2')

module.exports = function (io) {
  function getApps (io) {
    try {
      pm2.connect((err) => {
        if (err) {
          io.emit('error', err)
          console.warn(err)
          pm2.disconnect()
        } else {
          pm2.list((err, applist) => {
            if (err) {
              io.emit('error', err)
              console.warn(err)
            } else {
              io.emit('list-apps', applist)
            }
            pm2.disconnect()
          })
        }
      })
    } catch (e) {
      console.warn(e)
    }
  }

  setInterval(() => {
    throttle(getApps(io))
  }, 5000)

  io.on('connection', function (client) {
    console.log('Client connected', new Date())
    throttle(getApps(io))

    client.on('get-apps', function () {
      throttle(getApps(io))
    })

    client.on('start-app', function (app) {
      console.log('client.on(start-app)')
      pm2.connect(function (err) {
        if (err) {
          io.emit('error', err)
          console.warn(err)
        }

        pm2.start(app.path, {
          name: app.name
        }, function (err, apps) {
          if (err) {
            io.emit('error', err)
            console.warn(err)
          } else {
            throttle(getApps(io))
          }
          pm2.disconnect()
        })
      })
    })

    client.on('startagain-app', function (app) {
      console.log('client.on(startagain-app)')
      pm2.connect(function (err) {
        if (err) {
          io.emit('error', err)
          console.warn(err)
        }

        pm2.start(app, function (err, apps) {
          if (err) {
            io.emit('error', err)
            console.warn(err)
          } else {
            throttle(getApps(io))
          }
          pm2.disconnect()
        })
      })
    })

    client.on('restart-app', function (app) {
      console.log('client.on(restart-app)')
      pm2.connect(function (err) {
        if (err) {
          io.emit('error', err)
          console.warn(err)
        }

        pm2.restart(app, function (err, apps) {
          if (err) {
            io.emit('error', err)
            console.warn(err)
          } else {
            throttle(getApps(io))
          }
          pm2.disconnect()
        })
      })
    })

    client.on('del-app', function (app) {
      console.log('client.on(del-app)')
      pm2.connect(function (err) {
        if (err) {
          io.emit('error', err)
          console.warn(err)
        }

        pm2.delete(app, function (err, apps) {
          if (err) {
            io.emit('error', err)
            console.warn(err)
          } else {
            throttle(getApps(io))
          }
          pm2.disconnect()
        })
      })
    })

    client.on('stop-app', function (app) {
      console.log('client.on(stop-app)')
      pm2.connect(function (err) {
        if (err) {
          io.emit('error', err)
          console.warn(err)
        }

        pm2.stop(app, function (err, apps) {
          if (err) {
            io.emit('error', err)
            console.warn(err)
          } else {
            throttle(getApps(io))
          }
          pm2.disconnect()
        })
      })
    })

    client.on('disconnect', function () {
      console.log('client.on(disconnect)')
    })
  })
}

const throttle = (func) => {
  let inThrottle
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => { inThrottle = false }, 4500)
    }
  }
}
