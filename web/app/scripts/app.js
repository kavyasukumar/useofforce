'use strict';

/**
 * @ngdoc overview
 * @name webApp
 * @description
 * # webApp
 *
 * Main module of the application.
 */
angular
  .module('webApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'SubjectsCtrl'
      })
      .when('/incident/:incidentId', {
        templateUrl: 'views/incident.html',
        controller: 'IncidentsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .directive('errHide', function() {
    return {
      link: function(scope, element, attrs) {
        element.bind('error', function() {
          $(this).addClass('hide', true);
        });
      }
    }
  });


