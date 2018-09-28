var ctrl = angular.module('controllers', ['directives'])
var socket = io()

ctrl.controller('indexController', function ($scope, $interval) {
  $scope.propertyName = 'pm2_env.pm_uptime'
  $scope.reverse = true

  $scope.sortBy = function (propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false
    $scope.propertyName = propertyName
  }

  socket.on('error', function (error) {
    UIkit.notification({
      message: 'An error occured',
      status: 'danger',
      pos: 'top-center',
      timeout: 3000
    })
    console.warn(error)
  })

  socket.on('list-apps', function (appList) {
    $scope.applist = appList
    $scope.$evalAsync()

    $scope.startApp = function (name) {
      socket.emit('startagain-app', name)
      UIkit.notification("<span uk-icon='icon: play-circle'></span> Starte: " + name)
    }
    $scope.restartApp = function (name) {
      socket.emit('restart-app', name)
      UIkit.notification("<span uk-icon='icon: refresh'></span> Starte neu: " + name)
    }
    $scope.delApp = function (name) {
      var confdel = confirm('Are you sure you want to delete this app?')
      if (confdel) {
        socket.emit('del-app', name)
        UIkit.notification("<span uk-icon='icon: trash'></span> lösche: " + name)
      }
    }
    $scope.stopApp = function (name) {
      socket.emit('stop-app', name)
      UIkit.notification("<span uk-icon='icon: lifesaver'></span> Stop: " + name)
    }
  })
  /* $('#initapp').click(function() {
    var path = $('#newfilepath').val()
    var name = $('#newappname').val()
    if (path == "" || name == "") {
      UIkit.notification({
        message: "please fill out all the fields",
        status: 'primary',
        pos: 'top-center',
        timeout: 3000
      })
    } else {
      var obj = {
        'path': path,
        'name': name
      }
      socket.emit('start-app', obj)
      $('#startmodal').hide()
      // $('body').removeClass('loaded')
    }
  }) */
})
