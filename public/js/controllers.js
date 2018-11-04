var ctrl = angular.module('controllers', ['directives', 'ngStorage'])

var socket = io()

ctrl.controller('indexController', function ($scope, $localStorage) {
  $scope.optionsDefault = {
    dark: false,
    propertyName: 'pm2_env.pm_uptime',
    reverse: true,
    profi: false,
    popup: true
  }

  $scope.options = $localStorage.$default($scope.optionsDefault)

  $scope.darkcolor = function () {
    if ($scope.options.dark) {
      return '#222'
    } else {
      return '#fff'
    }
  }

  $scope.sortBy = function (propertyName) {
    $scope.options.reverse = ($scope.options.propertyName === propertyName) ? !$scope.options.reverse : false
    $scope.options.propertyName = propertyName
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

    if ($scope.options.popup) {
      UIkit.notification({
        message: 'Update',
        status: 'success',
        pos: 'bottom-right',
        timeout: 500
      })
    }
  })

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

  /* $('#initapp').click(function () {
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
