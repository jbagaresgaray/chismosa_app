'use strict';

var LoginCtrl = function($scope, $stateParams, $ionicModal, $location, $ionicPopup, $ionicLoading, LoginFactory) {
    console.log('LoginCtrl');
    $scope.login = {};
    $scope.doLogin = function() {

        $ionicLoading.show({
            template: 'Loading...'
        });

        console.log($scope.login);

        LoginFactory.query($scope.login)
            .success(function(data) {
                console.log('data');
                console.log(data);
                if (data) {
                    if (data[0].success == true && (data[0].users.length) > 0) {
                        console.log(data[0].users[0]);

                        $ionicLoading.hide();

                        $scope.users = data[0].users[0];
                        window.localStorage['users'] = JSON.stringify(data[0].users[0]);
                        console.log('$location.path(home);');
                        $location.path('/app/home');

                    } else if (data[0].success == true && (data[0].users.length) == 0) {
                        console.log('No user existed with that account');
                        $ionicLoading.hide();

                        $ionicPopup.alert({
                            title: 'Error',
                            template: 'No user existed with that account'
                        });
                        return;
                    } else if (data[0].success == false) {
                        console.log('pumasok dito');

                        if (data[0]) {
                            if (data[0].message.mobile_number) {
                                $ionicLoading.hide();

                                $ionicPopup.alert({
                                    title: 'Error',
                                    template: data[0].message.mobile_number.msg
                                });
                                return;
                            } else if (data[0].message.password) {
                                $ionicLoading.hide();

                                $ionicPopup.alert({
                                    title: 'Error',
                                    template: data[0].message.password.msg
                                });
                                return;
                            } else {
                                $ionicLoading.hide();

                                $ionicPopup.alert({
                                    title: 'Error',
                                    template: data[0].message
                                });
                                return;
                            }
                        } else {
                            console.log('else data[0]');
                            $ionicLoading.hide();

                            $ionicPopup.alert({
                                title: 'Error',
                                template: data[0].message
                            });
                            return;
                        }
                    }
                } else {
                    console.log('else');
                    $ionicLoading.hide();

                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'No user existed with that account'
                    });
                }
            })
            .error(function(error) {
                $ionicLoading.hide();
                console.log(error);
                /*$ionicPopup.alert({
          title: 'Error',
          template: error[0].message
        });*/
                return;
            });
    };
    $scope.doSignUp = function() {
        $location.path('/signup');
    }
};

Application.Controllers.controller('LoginCtrl', ['$scope', '$stateParams', '$ionicModal', '$location', '$ionicPopup', '$ionicLoading', 'LoginFactory', LoginCtrl]);
