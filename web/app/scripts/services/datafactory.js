'use strict';

/**
 * @ngdoc service
 * @name webApp.dataFactory
 * @description
 * # dataFactory
 * Factory in the webApp.
 */
angular.module('webApp')
  .factory('dataFactory', function ($http) {
     var incidents = { data:null};
     var subjects = {data:null}
     var dataService={};

     $http.get("data/incidents.json").success(function (data, status, headers, config) {
        incidents.data = data;
        $http.get("data/subjects.json").success(function (data, status, headers, config) {
          subjects.data = subjects;
          _.each(incidents.data, function(incident, index){
            var subs = _.where(subjects.data,{})
          })
        });
      });

     // Public members
     dataService.

     return dataService;
  });
