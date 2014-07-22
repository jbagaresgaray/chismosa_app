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

        UserFactory.updateName = function(users) {
            return $http.put(baseUrl + '/users_api/user/name/' + users.id, users);
        }
        UserFactory.updateStatus = function(users) {
            return $http.put(baseUrl + '/users_api/user/status/' + users.id, users);
        }
        UserFactory.updateNumber = function(users) {
            return $http.put(baseUrl + '/users_api/user/mobile/' + users.id, users);
        }
        UserFactory.updateEmail = function(users) {
            return $http.put(baseUrl + '/users_api/user/email/' + users.id, users);
        }
        UserFactory.updateProfilePic = function(users) {
            return $http.put(baseUrl + '/users_api/user/picture/' + users.id, users);
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

        ContactsFactory.deleteContacts = function(user_id, id) {
            return $http.delete(baseUrl + '/contacts_api/user_contacts/' + user_id + '/' + id);
        }

        ContactsFactory.create = function(contact) {
            return $http.post(baseUrl + '/contacts_api/contacts', contact);
        }

        ContactsFactory.findByAll = function(searchKey) {
            return $http.post(baseUrl + '/contacts_api/contacts', contact);
        }

        return ContactsFactory;
    }
]);


services.factory('ChatsFactory', ['$http',
    function($http) {
        var ChatsFactory = {};

        ChatsFactory.history = function(user_id) {
            return $http.get(baseUrl + '/message_api/chat/'  + user_id);
        }

        ChatsFactory.send = function(chat) {
            return $http.post(baseUrl + '/message_api/chat/', chat);
        }

        ChatsFactory.query = function(user_id,receiver_id) {
            return $http.get(baseUrl + '/message_api/chat/user/' + user_id + '/' + receiver_id);
        }

        ChatsFactory.delete = function(user_id,receiver_id) {
            return $http.post(baseUrl + '/message_api/chat/user/' + user_id + '/' + receiver_id);
        }

        return ChatsFactory;
    }
]);

