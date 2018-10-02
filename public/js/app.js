'use strict'

var app = angular.module('app', [
  'services',
  'controllers',
  'yaru22.angular-timeago'
])

angular.module('yaru22.angular-timeago').config(function (timeAgoSettings) {
  timeAgoSettings.overrideLang = 'de_DE'
  timeAgoSettings.breakpoints.hoursToDay = 49 // in hours
  timeAgoSettings.strings['de_DE'] = {
    prefixAgo: 'vor',
    prefixFromNow: 'in',
    suffixAgo: null,
    suffixFromNow: null,
    seconds: 'weniger als einer Minute',
    minute: 'ca. einer Minute',
    minutes: '%d Minuten',
    hour: 'ca. einer Stunde',
    hours: 'ca. %d Stunden',
    day: 'einem Tag',
    days: '%d Tagen',
    month: 'ca. einem Monat',
    months: '%d Monaten',
    year: 'ca. einem Jahr',
    years: '%d Jahren',
    numbers: []
  }
})
