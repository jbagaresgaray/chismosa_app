'use strict';

(function() {

    var Contacts = function($firebase, $firebaseArray) {
        var ref = new Firebase(firebaseUrl);
        var contacts = $firebaseArray(ref.child('contacts'));

        return {
            all: function() {
                return contacts;
            },
            get: function(contactId) {
                console.log('contactId: ',contactId);
                return contacts.$getRecord(contactId);
            },
            create: function(contact, email) {
                console.log("create contacts name :" + contact.name + " & message is " + email);
                if (contact && email) {
                    var contact = {
                        name: contact.name,
                        number: contact.number,
                        email: email,
                        createdAt: Firebase.ServerValue.TIMESTAMP
                    };
                    chats.$add(chatMessage).then(function(data) {
                        console.log("contacts added");
                    });
                }
            }
        }
    };

    Application.Services.factory('Contacts', ['$firebase', '$firebaseArray', Contacts]);

}());
