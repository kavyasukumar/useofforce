'use strict';

/**
 * @ngdoc function
 * @name webApp.controller:IncidentsCtrl
 * @description
 * # IncidentsCtrl
 * Controller of the webApp
 */
angular.module('webApp')
  .controller('IncidentsCtrl', function ($scope, $location, $routeParams, $anchorScroll, dataFactory) {
  	var incidentId = $routeParams.incidentId;
   	$scope.incident = dataFactory.getIncident(incidentId);

   	$('#cover').height('20vh');
   	$anchorScroll();
   	
   	$scope.getDate = function(datestr){
   		return new Date(datestr);
   	}

   	$scope.getNextIncident = function(){
   		$scope.hasNext = false;
   		var next = dataFactory.getNextIncident();
   		if(next){
   			$scope.hasNext = true;
   		}
   		return next;
   	}
   	$scope.getPrevIncident = function(){
   		$scope.hasPrev = false;
   		var prev = dataFactory.getPrevIncident();
   		if(prev){
   			$scope.hasPrev = true;
   		}
   		return prev;
   	}
  });
