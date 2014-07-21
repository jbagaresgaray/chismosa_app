'use strict';

var services = angular.module('todo.services', []);
var baseUrl = 'http://192.168.3.100:3000';

services.factory('LoginFactory', ['$http',
    function($http) {
        var LoginFactory = {};

        LoginFactory.query = function(users) {
            return $http.post(baseUrl + '/users_api/user/login', users);
        }

        return LoginFactory;
    }
]);









services.factory('UsersFactory', ['$http',
    function($http) {
        var UserFactory = {};

        UserFactory.query = function() {
            return $http.get(baseUrl + '/users_api/user');
        }
        UserFactory.create = function(users) {
            return $http.post(baseUrl + '/users_api/user', users);
        }
        UserFactory.show = function(id) {
            return $http.get(baseUrl + '/users_api/user/' + id);
        }
        UserFactory.update = function(users) {
            return $http.put(baseUrl + '/users_api/user/' + users.id, users);
        }
        UserFactory.delete = function(id) {
            return $http.delete(baseUrl + '/users_api/user/' + id);
        }

        return UserFactory;
    }
]);

services.factory('ContactsFactory', ['$http',
    function($http) {
        var ContactsFactory = {};

        ContactsFactory.query = function(user_id) {
            return $http.get(baseUrl + '/contacts_api/contacts/' + user_id);
        }

        ContactsFactory.showdetail = function(user_id, id) {
            return $http.get(baseUrl + '/contacts_api/user_contacts/' + user_id + '/' + id);
        }

        ContactsFactory.checkExisting = function(mobile_number) {
            return $http.get(baseUrl + '/contacts_api/contacts/mobile/' + mobile_number);
        }


        ContactsFactory.create = function(contact) {
            return $http.post(baseUrl + '/contacts_api/contacts', contact);
        }

        return ContactsFactory;
    }
]);









services.factory('ChatsFactory', ['$http',
    function($http) {
        var UserFactory = {};

        UserFactory.query = function() {
            return $http.get(baseUrl + '/api/employee');
        }

        UserFactory.create = function(employee) {
            return $http.post(baseUrl + '/api/employee', employee);
        }

        return EmployeesFactory;
    }
]);

services.factory('ChatFactory', ['$http',
    function($http) {
        var EmployeeFactory = {};
        EmployeeFactory.show = function(id) {
            return $http.get(baseUrl + '/api/employee/' + id);
        }
        EmployeeFactory.update = function(employee) {
            return $http.put(baseUrl + '/api/employee/' + employee._id, employee);
        }
        EmployeeFactory.delete = function(id) {
            return $http.delete(baseUrl + '/api/employee/' + id);
        }

        return EmployeeFactory;
    }
]);
