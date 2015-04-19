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
  })
   .factory('incidents', function ($http){
    var dataset ={data:null, filtereddata:null, currentIncident: null};
    var dataService ={};
    var subjectIds = null;
    var currentId = null;

    $http.get("data/incidents.json").success(function (data, status, headers, config) {
      dataset.data = data;
      dataService.filterList(subjectIds);
      dataService.getIncident(currentId);
    });

    dataService.getList =function(){
      return dataset;
    }
    dataService.filterList = function (filteredSubjects) {
        subjectIds = filteredSubjects;
        if(!filteredSubjects){
          dataset.filtereddata = _.clone(dataset.data);
          return;
        }
        var ids = _.pluck(filteredSubjects,"incidentId");
        var idlist = {};
        _.each(ids, function(id){ idlist[id] = true; })
        dataset.filtereddata = _.filter(dataset.data, function(d){ return idlist[d.id]; });
        return;
    }

    dataService.getIncident = function(id){
        currentId = id;
        if(dataset.data && currentId){
          var list = _.where(dataset.data, {"id": id.toUpperCase()});
          if(list){
            dataset.currentIncident = list[0];
          }
        }
        return dataset;
    }

    return dataService;
   })
   .factory('subjects', function ($http, incidents) {
     var dataset = { data:null, filteredLength: 0};
     var currentSubject ={data: null}
     var propRanges = {'ageRange':['-All-','Under 18','18-30','31-60','Over 60']}
     var ageBrackets = {
      'Under 18':[0,17],
      '18-30':[18,30],
      '31-60':[31,60],
      'Over 60':[61,1000]
    };
     var currentId = 0;
     var dataService = {};
     var defaultRangeVal ='-All-';
     var currentCriteria;

     function getAge(data){
        var incidentDate = new Date(data.date);
        var birthDate = new Date(data.dob);
        var age = incidentDate.getFullYear() - birthDate.getFullYear();
        var m = incidentDate.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && incidentDate.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
     }
     
     $http.get("data/subjects.json").success(function (data, status, headers, config) {
      
        dataset.data = data;
        resetFilters();

        for (var prop in dataset.data[0]) {
          if(dataset.data[0].hasOwnProperty(prop)){
              propRanges[prop] = _.chain(dataset.data)
                        .pluck(prop)
                        .uniq()
                        .without("")
                        .union(["-All-"])
                        .value()
                        .sort();

              // change range for year of incident
              propRanges['year'] = _.chain(dataset.data)
                        .pluck('date')
                        .map(function (date, index){ return new Date(date).getFullYear();})
                        .uniq()
                        .without("")
                        .union(["-All-"])
                        .value()
                        .sort();
          }
        }
        _filterList(currentCriteria);
     });
     var resetFilters = function(){
        //temp hack till subjects json is updated
        for(var i=0;i< dataset.data.length;i++){
          dataset.data[i].filterPass=true;
        }
        dataset.data = _.sortBy(dataset.data,function(d){ return d.sortorder;});
     }

     dataService.setCriteria = function(criteria){
        currentCriteria = criteria;
     }

     dataService.getList = function () {
         return dataset;
     }
     dataService.getRanges = function() {
        return propRanges;
     }
     dataService.filterList = function(criteria){
      resetFilters();
      for(var i=0;i<dataset.data.length;i++){
        var pass = true;
        var d = dataset.data[i];
        if(criteria.gender!=defaultRangeVal && d.gender!=criteria.gender){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.ethnicity!=defaultRangeVal && d.ethnicity!=criteria.ethnicity){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.injuryLevel!=defaultRangeVal && d.injuryLevel!=criteria.injuryLevel){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.shotAtPolice!=defaultRangeVal && d.shotAtPolice!=criteria.shotAtPolice){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.weapons!=defaultRangeVal && d.weapons!=criteria.weapons){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.year!=defaultRangeVal && new Date(d.date).getFullYear()!=criteria.year){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.agencies!=defaultRangeVal && d.agencies!=criteria.agencies){
          dataset.data[i].filterPass = false;
          continue;
        }
        if(criteria.incidentCity!=defaultRangeVal && d.incidentCity!=criteria.incidentCity){
          dataset.data[i].filterPass = false;
          continue;
        }
        // if(criteria.ageRange!=defaultRangeVal && 
        //       (getAge(d) < ageBrackets[criteria.ageRange][0] || getAge(d) > ageBrackets[criteria.ageRange][1])
        //   ){
        //   dataset.data[i].filterPass = false;
        //   continue;
        // }
      }
      dataset.data.filteredLength = _.where(dataset.data,{filterPass:true}).length;
      incidents.filterList(_.where(dataset.data,{filterPass:true}));
      //dataset.data = _.sortBy(dataset.data,function(d){ return !d.filterPass;})
     }
     var _filterList = dataService.filterList;
    return dataService;
  });


