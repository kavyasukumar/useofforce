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
     var dataset = { 
      incidents:null,
      subjects:null,
      totalSubjects: 0,
      filteredSubject: 0,
      totalIncidents: 0,
      filteredIncidents : 0
    };
     var agencies = null;
     var filterRanges ={};
     var dataService = {};
     var dataReady = false;
     var currFilters ={};

     $http.get("data/incidents.json").success(function (data, status, headers, config) {
        dataset.incidents = data;
        dataset.totalIncidents = data.length;
        // get subjects
        $http.get("data/subjects.json").success(function (data, status, headers, config) {
          dataset.subjects = data;
          dataset.totalSubjects = data.length;

          // get agencies
          $http.get("data/agencies.json").success(function (data, status, headers, config) {
            agencies = _.groupBy(data,'incidentId');

            // merge all datasets
            _.each(dataset.incidents, function(incident, index){
              var subs = _.where(dataset.subjects,{'incidentId':incident.id});
              var agncs = _.chain(agencies[incident.id]).pluck("agency").uniq().value();

              for(var i=0; i<subs.length;i++){
                subs[i]['agencies']=_.clone(agncs);
              }
              incident['subjects'] = _.clone(subs);
              incident['agencies'] = _.clone(agncs);
            });

            setFilterRanges();
            dataReady = true;
            filterData();
          });
        });
      });

     function setFilterRanges(){
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

          // agencies
          filterRanges['agencies'] = _.chain(dataset.subjects)
                    .pluck('agencies')
                    .flatten()
                    .uniq()
                    .without("")
                    .union(["-All-"])
                    .value()
                    .sort();

          // weapons
          filterRanges['weapons'] = _.chain(dataset.subjects)
                    .pluck('weapons')
                    .flatten()
                    .uniq()
                    .without("")
                    .union(["-All-"])
                    .value()
                    .sort();

        }
     }

     function resetFilters(){
      for(var i=0;i< dataset.subjects.length;i++){
          dataset.subjects[i].filterPass=true;
        }
        dataset.subects = _.sortBy(dataset.subjects,function(d){ return d.sortOrder;});
     }

     function filterData(){
      if(!dataReady){
        return;
      }
      resetFilters();
      filterSubjects();
    }

    function filterSubjects(){
      var defaultRangeVal ='-All-';
      // rewrite this
      for(var i=0;i<dataset.subjects.length;i++){
        var pass = true;
        var d = dataset.subjects[i];
        if(currFilters.gender!=defaultRangeVal && d.gender!=currFilters.gender){
          dataset.subjects[i].filterPass = false;
          continue;
        }
        if(currFilters.ethnicity!=defaultRangeVal && d.ethnicity!=currFilters.ethnicity){
          dataset.subjects[i].filterPass = false;
          continue;
        }
        if(currFilters.injuryLevel!=defaultRangeVal && d.injuryLevel!=currFilters.injuryLevel){
          dataset.subjects[i].filterPass = false;
          continue;
        }
        if(currFilters.shotAtPolice!=defaultRangeVal && d.shotAtPolice!=currFilters.shotAtPolice){
          dataset.subjects[i].filterPass = false;
          continue;
        }
        if(currFilters.incidentCity!=defaultRangeVal && d.incidentCity!=currFilters.incidentCity){
          dataset.subjects[i].filterPass = false;
          continue;
        }
        if(currFilters.year!=defaultRangeVal && new Date(d.date).getFullYear()!=currFilters.year){
          dataset.subjects[i].filterPass = false;
          continue;
        }
        if(currFilters.agencies!=defaultRangeVal && !_.contains(d.agencies,currFilters.agencies)){
          dataset.subjects[i].filterPass = false;
          continue;
        }
        if(currFilters.weapons!=defaultRangeVal && !_.contains(d.weapons,currFilters.weapons)){
          dataset.subjects[i].filterPass = false;
          continue;
        }
      }
      dataset.filteredSubject = _.where(dataset.subjects,{filterPass:true}).length;
    }

     // Public members
     dataService.getDataset = function(){
      return dataset;
     }

     dataService.setFilters = function(criteria){
        currFilters = criteria;
        filterData();
      }

     dataService.getFilterRanges = function (){
       return filterRanges;
     }

     return dataService;
  });
