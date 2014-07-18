var ctrl = angular.module('todo.controllers', []);

ctrl.controller('LoginCtrl', function ($scope, $stateParams, $ionicModal, $location, $ionicPopup, LoginFactory) {
        console.log('LoginCtrl');

        $scope.login = {};

        $scope.doLogin = function () {
                console.log('Doing login', $scope.login);
                LoginFactory.query($scope.login)
                        .success(function (data) {
                                console.log('data');
                                console.log(data);
                                if (data) {
                                        if (data[0].success == true) {
                                                console.log(data[0].users[0]);
                                                $scope.users = data[0].users[0];
                                                window.localStorage['users'] = JSON.stringify(data[0].users[0]);
                                                console.log('$location.path(home);');
                                                $location.path('/app/home');
                                        } else {
                                                if (data[0]) {
                                                        if (data[0].message.mobile_number) {
                                                                $ionicPopup.alert({
                                                                        title: 'Error',
                                                                        template: data[0].message.mobile_number.msg
                                                                });
                                                        } else if (data[0].message.password) {
                                                                $ionicPopup.alert({
                                                                        title: 'Error',
                                                                        template: data[0].message.password.msg
                                                                });
                                                        }

                                                } else {
                                                        $ionicPopup.alert({
                                                                title: 'Error',
                                                                template: 'No user existed with that account'
                                                        });
                                                }
                                        }
                                } else {
                                        $ionicPopup.alert({
                                                title: 'Error',
                                                template: 'No user existed with that account'
                                        });
                                }

                        })
                        .error(function (error) {
                                $ionicPopup.alert({
                                        title: 'Error',
                                        template: error[0].message
                                });
                                return;
                        });
        };
});

ctrl.controller('AppCtrl', function ($scope, $stateParams, $ionicModal) {
        console.log('AppCtrl');

        $ionicModal.fromTemplateUrl('templates/search.html', {
                scope: $scope
        }).then(function ($ionicModal) {
                $scope.searchmodal = $ionicModal;
        });

        $scope.openSearch = function () {
                console.log('openSearch');
                $scope.searchmodal.show();
        };

        $scope.closeSearch = function () {
                console.log('closeCompose');
                $scope.searchmodal.hide();
        };

        $scope.$on('$destroy', function () {
                $scope.searchmodal.remove();
        });

        // Execute action on hide modal
        $scope.$on('searchmodal.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('searchmodal.removed', function () {
                // Execute action
        });


        $ionicModal.fromTemplateUrl('templates/messageDetail.html', {
                scope: $scope
        }).then(function ($ionicModal) {
                $scope.messagedetail = $ionicModal;
        });

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

        $scope.profile = function () {
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

        // Execute action on hide modal
        $scope.$on('profilemodal.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('profilemodal.removed', function () {
                // Execute action
        });


        $scope.contacts = [
                {
                        id: 1,
                        name: 'John Doe',
                        number: '+639161234567'
                },
                {
                        id: 2,
                        name: 'John Doe',
                        number: '+639161234567'
                },
                {
                        id: 3,
                        name: 'John Doe',
                        number: '+639161234567'
                },
                {
                        id: 4,
                        name: 'John Doe',
                        number: '+639161234567'
                }
        ];
        console.log($scope.contacts);

        var messageOptions = [
                {
                        message: '<p>Wow, this is really something huh? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
                },
                {
                        message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
                },
                {
                        message: '<p>Gee wiz, this is something special. <br>1:50 PM</p>'
                },
                {
                        message: '<p>Am I dreaming? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
                },
                {
                        message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
                },
                {
                        message: '<p>Is this magic? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Am I dreaming? <br>1:50 PM</p>'
                }
        ];

        var messageIter = 0;
        $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);
});

ctrl.controller('ProfileCtrl', function ($scope, $ionicPopup) {
        console.log('ProfileCtrl');

        $scope.showName = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                        template: '<input type="text" ng-model="data.name">',
                        title: 'Set Name',
                        scope: $scope,
                        buttons: [
                                {
                                        text: 'Cancel'
                                },
                                {
                                        text: '<b>Save</b>',
                                        type: 'button-positive',
                                        onTap: function (e) {
                                                if (!$scope.data.name) {
                                                        e.preventDefault();
                                                } else {
                                                        return $scope.data.name;
                                                }
                                        }
                        },
                ]
                });

        };

        $scope.showPicOption = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                        template: '<div class="list"><a class="item" ng-click="showProfilePic()">Profile Photo</a><a class="item" ng-click="showCoverPic()">Cover Photo</a></div>',
                        title: 'Set Profile/Cover Photo',
                        scope: $scope,
                        buttons: [
                                {
                                        text: 'Cancel'
                                }
                        ]
                });

        };

        $scope.showProfilePic = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                        template: '<div class="list"><a class="item item-icon-left"><i class="icon ion-camera"></i>Camera</a><a class="item item-icon-left"><i class="icon ion-images"></i>Gallery</a><a class="item item-icon-left"><i class="icon ion-close-round"></i>Remove</a></div>',
                        title: 'Set Profile Photo',
                        scope: $scope,
                        buttons: [
                                {
                                        text: 'Cancel'
                                }
                ]
                });

        };

        $scope.showCoverPic = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                        template: '<div class="list"><a class="item item-icon-left"><i class="icon ion-camera"></i>Camera</a><a class="item item-icon-left"><i class="icon ion-images"></i>Gallery</a><a class="item item-icon-left"><i class="icon ion-close-round"></i>Remove</a></div>',
                        title: 'Set Cover Photo',
                        scope: $scope,
                        buttons: [
                                {
                                        text: 'Cancel'
                                }
                ]
                });

        };

        $scope.showStatus = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                        template: '<textarea id="message" ng-model="data.status" style="overflow:hidden;height:80px;" ng-trim="false" maxlength="450" row="4" column="10"></textarea><span>{{200 - data.status.length}}</span>',
                        title: 'Set Status',
                        scope: $scope,
                        buttons: [
                                {
                                        text: 'Cancel'
                                },
                                {
                                        text: '<b>Delete</b>',
                                        type: 'button-assertive',

                        },
                                {
                                        text: '<b>Save</b>',
                                        type: 'button-positive',
                                        onTap: function (e) {
                                                if (!$scope.data.status) {
                                                        e.preventDefault();
                                                } else {
                                                        return $scope.data.status;
                                                }
                                        }
                        },
                ]
                });

        };

        $scope.showMobile = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                        template: '<input type="text" ng-model="data.number">',
                        title: 'Edit Mobile Number',
                        scope: $scope,
                        buttons: [
                                {
                                        text: 'Cancel'
                                },
                                {
                                        text: '<b>Save</b>',
                                        type: 'button-positive',
                                        onTap: function (e) {
                                                if (!$scope.data.number) {
                                                        e.preventDefault();
                                                } else {
                                                        return $scope.data.number;
                                                }
                                        }
                        },
                ]
                });

        };

        $scope.showEmail = function () {
                $scope.data = {}
                var myPopup = $ionicPopup.show({
                        template: '<input type="email" ng-model="data.email">',
                        title: 'Edit Email Address',
                        scope: $scope,
                        buttons: [
                                {
                                        text: 'Cancel'
                                },
                                {
                                        text: '<b>Save</b>',
                                        type: 'button-positive',
                                        onTap: function (e) {
                                                if (!$scope.data.email) {
                                                        e.preventDefault();
                                                } else {
                                                        return $scope.data.email;
                                                }
                                        }
                        },
                ]
                });

        };
});

ctrl.controller('SearchCtrl', function ($scope) {
        console.log('SearchCtrl');
});


ctrl.controller('MsgCtrl', function ($scope, $ionicModal) {

        console.log('MsgCtrl');

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

        // Execute action on hide modal
        $scope.$on('composeModal.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('composeModal.removed', function () {
                // Execute action
        });





        $ionicModal.fromTemplateUrl('templates/messageDetail.html', {
                scope: $scope
        }).then(function ($ionicModal) {
                $scope.messagedetail = $ionicModal;
        });

        $scope.openMessageDetail = function () {
                console.log('openMessageDetail');
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

        // Execute action on hide modal
        $scope.$on('messagedetail.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('messagedetail.removed', function () {
                // Execute action
        });


        $ionicModal.fromTemplateUrl('templates/friendProfile.html', {
                scope: $scope
        }).then(function ($ionicModal) {
                $scope.profilemodal = $ionicModal;
        });

        $scope.profile = function () {
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

        // Execute action on hide modal
        $scope.$on('profilemodal.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('profilemodal.removed', function () {
                // Execute action
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

        // Execute action on hide modal
        $scope.$on('createModal.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('createModal.removed', function () {
                // Execute action
        });



        $scope.messages = [
                {
                        id: 1,
                        name: 'Jane Doe',
                        content: 'Yea, it\'s pretty sweet',
                        date: 'Jul 14'
                },
                {
                        id: 2,
                        name: 'Jane Doe',
                        content: 'Yea, it\'s pretty sweet',
                        date: 'Jul 14'
                },
                {
                        id: 3,
                        name: 'Jane Doe',
                        content: 'Yea, it\'s pretty sweet',
                        date: 'Jul 14'
                },
                {
                        id: 4,
                        name: 'Jane Doe',
                        content: 'Yea, it\'s pretty sweet',
                        date: 'Jul 14'
                }
        ];

        $scope.contacts = [
                {
                        id: 1,
                        name: 'John Doe',
                        number: '+639161234567'
                },
                {
                        id: 2,
                        name: 'John Doe',
                        number: '+639161234567'
                },
                {
                        id: 3,
                        name: 'John Doe',
                        number: '+639161234567'
                },
                {
                        id: 4,
                        name: 'John Doe',
                        number: '+639161234567'
                }
        ];
        console.log($scope.contacts);

        var messageOptions = [
                {
                        message: '<p>Wow, this is really something huh? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
                },
                {
                        message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
                },
                {
                        message: '<p>Gee wiz, this is something special. <br>1:50 PM</p>'
                },
                {
                        message: '<p>Am I dreaming? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
                },
                {
                        message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
                },
                {
                        message: '<p>Is this magic? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Am I dreaming? <br>1:50 PM</p>'
                }
        ];

        var messageIter = 0;
        $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);
});


ctrl.controller('ContactsCtrl', function ($scope, $ionicModal, $ionicLoading, UsersFactory) {

        console.log('ContactsCtrl');

        $ionicModal.fromTemplateUrl('templates/friendProfile.html', {
                scope: $scope
        }).then(function ($ionicModal) {
                $scope.profileModal = $ionicModal;
        });
        $scope.openProfile = function () {
                console.log('openProfile');
                $scope.profileModal.show();
        };
        $scope.closeprofile = function () {
                console.log('closeprofile');
                $scope.profileModal.hide();
        };
        $scope.$on('$destroy', function () {
                $scope.profileModal.remove();
        });
        // Execute action on hide modal
        $scope.$on('profileModal.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('profileModal.removed', function () {
                // Execute action
        });



        $ionicModal.fromTemplateUrl('templates/createcontacts.html', {
                scope: $scope
        }).then(function ($ionicModal) {
                $scope.createModal = $ionicModal;
        });

        $scope.openCreateContact = function () {
                console.log('openCreateContact');
                $scope.createModal.show();
        };

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

        // Execute action on hide modal
        $scope.$on('createModal.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('createModal.removed', function () {
                // Execute action
        });




        $ionicModal.fromTemplateUrl('templates/messageDetail.html', {
                scope: $scope
        }).then(function ($ionicModal) {
                $scope.messagedetail = $ionicModal;
        });

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

        // Execute action on hide modal
        $scope.$on('messagedetail.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('messagedetail.removed', function () {
                // Execute action
        });




        $ionicModal.fromTemplateUrl('templates/search.html', {
                scope: $scope
        }).then(function ($ionicModal) {
                $scope.searchmodal = $ionicModal;
        });
        $scope.openSearch = function () {
                console.log('openSearch');
                $scope.searchmodal.show();
        };
        $scope.closeSearch = function () {
                console.log('closeCompose');
                $scope.searchmodal.hide();
        };
        $scope.$on('$destroy', function () {
                $scope.searchmodal.remove();
        });
        // Execute action on hide modal
        $scope.$on('searchmodal.hidden', function () {
                // Execute action
        });
        // Execute action on remove modal
        $scope.$on('searchmodal.removed', function () {
                // Execute action
        });


        function getContacts() {
                $ionicLoading.show({
                        template: 'Loading...'
                });
                UsersFactory.query()
                        .success(function (data) {
                                console.log(data);
                                $scope.contacts = data;
                                console.log($scope.contacts);

                                $ionicLoading.hide();
                        })
                        .error(function (error) {
                                $ionicLoading.hide();
                                console.log(error);
                                $scope.status = 'Unable to load customer data: ' + error.message;
                        });
        }


        var messageOptions = [
                {
                        message: '<p>Wow, this is really something huh? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
                },
                {
                        message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
                },
                {
                        message: '<p>Gee wiz, this is something special. <br>1:50 PM</p>'
                },
                {
                        message: '<p>Am I dreaming? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Yea, it\'s pretty sweet <br>1:50 PM</p>'
                },
                {
                        message: '<p>I think I like Ionic more than I like ice cream! <br>1:50 PM</p>'
                },
                {
                        message: '<p>Is this magic? <br>1:50 PM</p>'
                },
                {
                        message: '<p>Am I dreaming? <br>1:50 PM</p>'
                }
        ];

        var messageIter = 0;
        $scope.messagesdetails = messageOptions.slice(0, messageOptions.length);

        getContacts();
});
