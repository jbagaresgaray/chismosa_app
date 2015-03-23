'use strict';

(function() {

    var Users = function($firebase, $firebaseArray, $firebaseObject) {
        console.log('firebaseUrl 2: ', firebaseUrl);
        var ref = new Firebase(firebaseUrl);
        var users = $firebaseObject(ref.child('contacts'));

        return {
            all: function() {
                return users;
            },
            get: function(contactId) {
                return users.$getRecord(contactId);
            }
        }
    };

    Application.Services.factory('Users', ['$firebase', '$firebaseArray', '$firebaseObject', Users]);

}());
