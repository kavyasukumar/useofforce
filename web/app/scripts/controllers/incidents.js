'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:IncidentsCtrl
 * @description
 * # IncidentsCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('IncidentsCtrl', function ($scope, $location, $routeParams, incidents) {
  	var incidentId = $routeParams.incidentId;
   	$scope.incident = incidents.getIncident(incidentId);
  });
