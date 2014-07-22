'use strict';

var LoginCtrl = function ($scope, $stateParams, $ionicModal, $location, $ionicPopup, $ionicLoading, LoginFactory) {
  console.log('LoginCtrl');
  $scope.login = {};
  $scope.doLogin = function () {

    $ionicLoading.show({
      template: 'Loading...'
    });

    LoginFactory.query($scope.login)
      .success(function (data) {
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
            $ionicLoading.hide();

            $ionicPopup.alert({
              title: 'Error',
              template: 'No user existed with that account'
            });

          } else if (data[0].success == false && (data[0].message.length) > 0) {

            if (data[0]) {
              if (data[0].message.mobile_number) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                  title: 'Error',
                  template: data[0].message.mobile_number.msg
                });
              } else if (data[0].message.password) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                  title: 'Error',
                  template: data[0].message.password.msg
                });
              } else {
                $ionicLoading.hide();

                $ionicPopup.alert({
                  title: 'Error',
                  template: data[0].message
                });
              }
            } else {
              $ionicLoading.hide();

              $ionicPopup.alert({
                title: 'Error',
                template: data[0].message
              });
            }
          }
        } else {
          $ionicLoading.hide();

          $ionicPopup.alert({
            title: 'Error',
            template: 'No user existed with that account'
          });
        }
      })
      .error(function (error) {
        $ionicLoading.hide();

        $ionicPopup.alert({
          title: 'Error',
          template: error[0].message
        });
        return;
      });
  };
  $scope.doSignUp = function () {
    $location.path('/signup');
  }
};

Application.Controllers.controller('LoginCtrl', ['$scope', '$stateParams', '$ionicModal', '$location', '$ionicPopup', '$ionicLoading', 'LoginFactory', LoginCtrl]);
