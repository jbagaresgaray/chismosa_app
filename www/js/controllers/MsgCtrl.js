'use strict';

var MsgCtrl = function ($scope, $ionicModal, $ionicLoading, $location, $ionicPopup, $ionicScrollDelegate, $timeout,
    ContactsFactory, ChatsFactory, NotifFactory, socket) {
    console.log('MsgCtrl');

    var users = JSON.parse(window.localStorage['users'] || '{}');

    function mysql_real_escape_string(str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
            }
        });
    }

    $ionicModal.fromTemplateUrl('templates/compose.html', {
        scope: $scope
    }).then(function ($ionicModal) {
        $scope.composeModal = $ionicModal;
    });
    $scope.compose = function () {
        console.log('compose');
        $scope.composeModal.show();
    };
    $scope.closeCompose = function () {
        console.log('closeCompose');
        $scope.composeModal.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.composeModal.remove();
    });


    $ionicModal.fromTemplateUrl('templates/messageDetail.html', {
        scope: $scope
    }).then(function ($ionicModal) {
        $scope.messagedetail = $ionicModal;
    });
    $scope.openMessageDetail = function (receiver_id) {
        console.log('openMessageDetail');

        getChatDetail(receiver_id);
        getContactDetails(users.id, receiver_id);

        $scope.messagedetail.show();
    };
    $scope.composeMessage = function () {
        console.log('openMessageDetail');
        $scope.messagedetail.show();
    };
    $scope.closeMessageDetail = function () {
        console.log('closeMessageDetail');
        $scope.messagedetail.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.messagedetail.remove();
    });

    $ionicModal.fromTemplateUrl('templates/friendProfile.html', {
        scope: $scope
    }).then(function ($ionicModal) {
        $scope.profilemodal = $ionicModal;
    });
    $scope.openProfile = function () {
        console.log('profile');
        $scope.profilemodal.show();
    };
    $scope.closeprofile = function () {
        console.log('closeprofile');
        $scope.profilemodal.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.profilemodal.remove();
    });

    $ionicModal.fromTemplateUrl('templates/createcontacts.html', {
        scope: $scope
    }).then(function ($ionicModal) {
        $scope.createModal = $ionicModal;
    });
    $scope.modifyContact = function () {
        console.log('openCreateContact');
        $scope.createModal.show();
    };
    $scope.closeCreateContact = function () {
        console.log('closeCreateContact');
        $scope.createModal.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.createModal.remove();
    });


    $scope.submitChat = function (receiver_id) {

        $scope.chat.receiver_id = receiver_id;
        $scope.chat.user_id = users.id;

        console.log($scope.chat);

        ChatsFactory.send($scope.chat)
            .success(function (data) {
                console.log(data);
                if (data[0].success === false) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: 'Error',
                        template: data[0].message.message.msg
                    });
                } else {
                    getChatDetail(receiver_id);
                    $scope.chat.chatmessage = "";
                }
            })
            .error(function (error) {
                $ionicLoading.hide();
                console.log(error);
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    };

    function getContacts() {
        $ionicLoading.show({
            template: 'Loading...'
        });

        ContactsFactory.query(users.id)
            .success(function (data) {
                $scope.contacts = data;
                window.localStorage['contacts'] = JSON.stringify(data);
                $ionicLoading.hide();
            })
            .error(function (error) {
                $ionicLoading.hide();
                console.log(error);
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

    function getContactDetails(user_id, id) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        $scope.newcontact = {};
        ContactsFactory.showdetail(user_id, id)
            .success(function (data) {
                $scope.profiledetail = data[0];
                $scope.contact_id = data[0].id;

                $scope.newcontact.name = data[0].contact_name;
                $scope.newcontact.areacode = data[0].contact_areacode;
                $scope.newcontact.mobile_number = data[0].contact_number;
                $scope.newcontact.email = data[0].contact_email;

                $ionicLoading.hide();
            })
            .error(function (error) {
                $ionicLoading.hide();
                console.log(error);
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

    function getChatHistory() {
        console.log('getChatHistory -- controllers');
        $ionicLoading.show({
            template: 'Loading...'
        });

        ChatsFactory.history(users.id)
            .success(function (data) {
                console.log(data);
                if (data[0].success === true) {
                    $ionicLoading.hide();
                    $scope.messages = data[0].data;
                } else {
                    $ionicLoading.hide();
                }
            })
            .error(function (error) {
                $ionicLoading.hide();
                console.log(error);
                $scope.status = 'Unable to load user chat history: ' + error.message;
            });
    }

    function getChatDetail(receiver_id) {
        console.log('getChatDetail -- controllers');
        $ionicLoading.show({
            template: 'Loading...'
        });

        ChatsFactory.query(users.id, receiver_id)
            .success(function (data) {
                if (data[0].success === true) {
                    $ionicLoading.hide();

                    console.log(data[0].data);

                    var newValue = new Array();
                    var i;
                    for (i = 0; i < data[0].data.length; i++) {
                        var msg = data[0].data[i].message;
                        var datecreated = data[0].data[i].datecreated;
                        var receiver = data[0].data[i].receiver_id;
                        var user_id = data[0].data[i].user_id;
                        var msg_id = data[0].data[i].id;

                        var myObj = new Object();
                        myObj.message = '<p>' + msg + '<br>' + datecreated + '</p>';
                        myObj.user_id = user_id;
                        myObj.receiver_id = receiver_id;
                        myObj.id = msg_id;

                        newValue.push(myObj);
                    }

                    var messageOptions = newValue;

                    $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);
                    $scope.chat = {};
                    $ionicScrollDelegate.scrollBottom(true);
                }
            })
            .error(function (error) {
                $ionicLoading.hide();
                console.log(error);
                $scope.status = 'Unable to load user chat history: ' + error.message;
            });
    }

    $scope.doRefresh = function () {
        console.log('Refreshing!');
        ChatsFactory.history(users.id)
            .success(function (data) {
                if (data[0].success === true) {
                    $ionicLoading.hide();
                    $scope.messages = data[0].data;
                }
            })
            .finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefreshMessage = function (receiver_id) {
        console.log('Refreshing!');
        ChatsFactory.query(users.id, receiver_id)
            .success(function (data) {
                if (data[0].success === true) {
                    $ionicLoading.hide();

                    console.log(data[0].data);

                    var newValue = new Array();
                    var i;
                    for (i = 0; i < data[0].data.length; i++) {
                        var msg = data[0].data[i].message;
                        var datecreated = data[0].data[i].datecreated;
                        var receiver = data[0].data[i].receiver_id;
                        var user_id = data[0].data[i].user_id;
                        var msg_id = data[0].data[i].id;

                        var myObj = new Object();
                        myObj.message = '<p>' + msg + '<br>' + datecreated + '</p>';
                        myObj.user_id = user_id;
                        myObj.receiver_id = receiver_id;
                        myObj.id = msg_id;

                        newValue.push(myObj);
                    }

                    var messageOptions = newValue;

                    $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);
                    $scope.chat = {};
                    $ionicScrollDelegate.scrollBottom(true);
                }
            })
            .finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.doRefresh = function () {
        console.log('Refreshing!');
        $scope.notifs = {};
        NotifFactory.query(users.id)
            .success(function (data) {
                console.log(data);
                if (data[0].success === true) {
                    $scope.notifs = data[0].notif;
                }
            })
            .finally(function () {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };



    function getNotification() {
        console.log('getNotification');
        $scope.notifs = {};
        NotifFactory.query(users.id)
            .success(function (data) {
                console.log(data);
                if (data[0].success === true) {
                    $scope.notifs = data[0].notif;
                }
            })
            .error(function (error) {
                console.log(error);
                $scope.status = 'Unable to load customer data: ' + error.message;
            });
    }

    getContacts();
    getChatHistory();
    getNotification();


    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    //Socket.io listeners
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    /*socket.on('channels', function channels(channels) {
        console.log('channels', channels);

        console.log(channels);
        $scope.channels = channels;
        $scope.channels = channels;
    });

    socket.on('message:received', function messageReceived(message) {
        $scope.messages.push(message);
    });

    socket.emit('user:joined', {
        name: users.name
    });

    socket.on('user:joined', function (user) {
        console.log('user:joined');
        $scope.messages.push(user);
    });

    $scope.listenChannel = function listenChannel(channel) {
        socket.on('messages:channel:' + channel, function messages(messages) {
            console.log('got messages: ', messages);
            console.log(messages.length);
            for (var i = 0, j = messages.length; i < j; i++) {
                var message = messages[i];
                console.log('message');
                console.log(message);
                console.log('apply with function');
                $scope.messages.push(message);
            }
        });

        socket.on('message:channel:' + channel, function message(message) {
            console.log('got message: ' + message);
            if (channel != $scope.activeChannel) {
                return;
            }
            $scope.messages.push(message);
        });

        socket.on('message:remove:channel:' + channel, function (removalInfo) {
            console.log('removalInfo to remove: ', removalInfo);
            var expires = removalInfo.message.expires;
            var expireMessageIndex = $filter('messageByExpires')($scope.messages, expires);
            if (expireMessageIndex) {
                $scope.messages.splice(expireMessageIndex, 1);
            }

        });

        $scope.listeningChannels.push(channel);

    }*/
};

Application.Controllers.controller('MsgCtrl', ['$scope', '$ionicModal', '$ionicLoading', 'ContactsFactory', MsgCtrl]);
