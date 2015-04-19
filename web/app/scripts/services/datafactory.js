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
     var dataset = { incidents:null, subjects:null};
     var agencies = null;
     var filterRanges ={};
     var dataService = {};

     $http.get("data/incidents.json").success(function (data, status, headers, config) {
        dataset.incidents = data;
        // get subjects
        $http.get("data/subjects.json").success(function (data, status, headers, config) {
          dataset.subjects = data;

          // get agencies
          $http.get("data/agencies.json").success(function (data, status, headers, config) {
            agencies = _.groupBy(data,'incidentId');

            // merge all datasets
            _.each(dataset.incidents, function(incident, index){
              var subs = _.where(dataset.subjects,{'incidentId':incident.id});
              var agncs = _.chain(agencies["LM33"]).pluck("agency").uniq().value();

              for(var i=0; i<subs.length;i++){
                subs[i]['agencies']=_.clone(agncs);
              }
              incident['subjects'] = _.clone(subs);
              incident['agencies'] = _.clone(agncs);
            });

            for (var prop in dataset.subjects[0]) {
              if(dataset.subjects[0].hasOwnProperty(prop)){
                filterRanges[prop] = _.chain(dataset.subjects)
                        .pluck(prop)
                        .uniq()
                        .without("")
                        .union(["-All-"])
                        .value()
                        .sort();
              }

              // change range for year of incident
              filterRanges['year'] = _.chain(dataset.subjects)
                        .pluck('date')
                        .map(function (date, index){ return new Date(date).getFullYear();})
                        .uniq()
                        .without("")
                        .union(["-All-"])
                        .value()
                        .sort();
            }
          });
        });
      });

     // Public members
     dataService.getFilteredDataset = function(currentSelection){
      return dataset;
     }

     dataService.getFilterRanges = function (){
       return filterRanges;
     }

     return dataService;
  });
