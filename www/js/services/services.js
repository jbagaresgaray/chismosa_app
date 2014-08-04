'use strict';

var baseUrl = 'http://192.168.3.101:3000';

angular.module('todo.services', [])
    .factory('LoginFactory', ['$http',
        function($http) {
            var LoginFactory = {};

            LoginFactory.query = function(users) {
                return $http.post(baseUrl + '/login_api/user/login', users);
            }

            return LoginFactory;
        }
    ])

.factory('NotifFactory', ['$http',
    function($http) {
        var NotifFactory = {};

        NotifFactory.query = function(user_id) {
            return $http.get(baseUrl + '/notif_api/notification/' + user_id);
        }

        NotifFactory.read = function(notif_id) {
            return $http.put(baseUrl + '/notif_api/notification/read', notif_id);
        }

        return NotifFactory;
    }
])

.factory('UsersFactory', ['$http',
    function($http) {
        var UsersFactory = {};

        UsersFactory.query = function() {
            return $http.get(baseUrl + '/users_api/user');
        }
        UsersFactory.create = function(users) {
            return $http.post(baseUrl + '/users_api/user', users);
        }
        UsersFactory.show = function(id) {
            return $http.get(baseUrl + '/users_api/user/' + id);
        }

        UsersFactory.updateName = function(users) {
            return $http.put(baseUrl + '/users_api/user/name/' + users.id, users);
        }
        UsersFactory.updateStatus = function(users) {
            return $http.put(baseUrl + '/users_api/user/status/' + users.id, users);
        }
        UsersFactory.updateNumber = function(users) {
            return $http.put(baseUrl + '/users_api/user/mobile/' + users.id, users);
        }
        UsersFactory.updateEmail = function(users) {
            return $http.put(baseUrl + '/users_api/user/email/' + users.id, users);
        }
        UsersFactory.updateProfilePic = function(users) {
            return $http.put(baseUrl + '/users_api/user/picture/' + users.id, users);
        }
        UsersFactory.delete = function(id) {
            return $http.delete(baseUrl + '/users_api/user/' + id);
        }



        UsersFactory.search = function(value) {
            return $http.post(baseUrl + '/search_api/search/', value);
        }

        return UsersFactory;
    }
])

.factory('ContactsFactory', ['$http',
    function($http) {
        var ContactsFactory = {};

        ContactsFactory.query = function(user_id) {
            return $http.get(baseUrl + '/contacts_api/contacts/' + user_id);
        }

        ContactsFactory.showdetail = function(user_id, id) {
            return $http.get(baseUrl + '/contacts_api/user_contacts/' + user_id + '/' + id);
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

        ContactsFactory.sendRequest = function(friend) {
            return $http.post(baseUrl + '/contacts_api/contacts/request/', friend);
        }

        ContactsFactory.confirmRequest = function(friend) {
            return $http.put(baseUrl + '/contacts_api/contacts/confirm/', friend);
        }

        ContactsFactory.denyRequest = function(friend) {
            return $http.put(baseUrl + '/contacts_api/contacts/deny/', friend);
        }

        return ContactsFactory;
    }
])


.factory('ChatsFactory', ['$http',
    function($http) {
        var ChatsFactory = {};

        ChatsFactory.history = function(user_id) {
            return $http.get(baseUrl + '/message_api/chat/' + user_id);
        }

        ChatsFactory.send = function(chat) {
            return $http.post(baseUrl + '/message_api/chat/', chat);
        }

        ChatsFactory.query = function(user_id, receiver_id) {
            return $http.get(baseUrl + '/message_api/chat/user/' + user_id + '/' + receiver_id);
        }

        ChatsFactory.delete = function(user_id, receiver_id) {
            return $http.post(baseUrl + '/message_api/chat/user/' + user_id + '/' + receiver_id);
        }

        return ChatsFactory;
    }
])

.factory('socket', ['$rootScope',
    function socket($rootScope) {
        var socket = io.connect(baseUrl);

        var safeApply = function(scope, fn) {
            if (scope.$$phase) {
                fn(); // digest already in progress, just run the function
            } else {
                scope.$apply(fn); // no digest in progress, run with $apply
            }
        };

        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    /*$rootScope.$apply(function() {
                    callback.apply(socket, args);
                });*/
                    safeApply($rootScope, function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    /*$rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });*/
                    safeApply($rootScope, function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            },
            disconnect: function() {
                socket.disconnect();
            },
            socket: socket
        };
    }
]);
