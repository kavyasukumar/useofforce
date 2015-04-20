'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:IncidentsCtrl
 * @description
 * # IncidentsCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('IncidentsCtrl', function ($scope, $location, $routeParams, dataFactory) {
  	var incidentId = $routeParams.incidentId;
   	$scope.incident = dataFactory.getIncident(incidentId);
   	
   	$scope.getDate = function(datestr){
   		return new Date(datestr);
   	}
  });
