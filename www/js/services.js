'use strict';

var services = angular.module('todo.services', []);
var baseUrl = 'http://localhost:3000';

services.factory('LoginFactory', ['$http', function($http)  {
    var LoginFactory = {};

    LoginFactory.query = function(users){
        return $http.post(baseUrl + '/users_api/user/login',users);
    }

    return LoginFactory;
}]);


services.factory('UsersFactory', ['$http', function($http)  {
    var UserFactory = {};

    UserFactory.query = function(){
        return $http.get(baseUrl + '/users_api/user');
    }

    UserFactory.create = function(employee){
        return $http.post(baseUrl + '/users_api/user',users);
    }

    return UserFactory;
}]);

services.factory('UserFactory', ['$http',function ($http) {
    var EmployeeFactory = {};
    EmployeeFactory.show = function(id){
        return $http.get(baseUrl + '/api/employee/' + id);
    }
    EmployeeFactory.update = function(employee){
        return $http.put(baseUrl + '/api/employee/' + employee._id, employee);
    }
    EmployeeFactory.delete = function(id){
        return $http.delete(baseUrl + '/api/employee/' + id);
    }

    return EmployeeFactory;
}]);

services.factory('ChatsFactory', ['$http', function($http)  {
    var UserFactory = {};

    UserFactory.query = function(){
        return $http.get(baseUrl + '/api/employee');
    }

    UserFactory.create = function(employee){
        return $http.post(baseUrl + '/api/employee',employee);
    }

    return EmployeesFactory;
}]);

services.factory('ChatFactory', ['$http',function ($http) {
    var EmployeeFactory = {};
    EmployeeFactory.show = function(id){
        return $http.get(baseUrl + '/api/employee/' + id);
    }
    EmployeeFactory.update = function(employee){
        return $http.put(baseUrl + '/api/employee/' + employee._id, employee);
    }
    EmployeeFactory.delete = function(id){
        return $http.delete(baseUrl + '/api/employee/' + id);
    }

    return EmployeeFactory;
}]);
