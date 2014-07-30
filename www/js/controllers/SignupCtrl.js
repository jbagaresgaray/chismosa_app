'use strict';

var SignupCtrl = function ($scope, $state, $ionicPopup, $ionicLoading, $location, $ionicNavBarDelegate, UsersFactory) {
  console.log('SignupCtrl');
  $scope.register = {};

  $scope.goBack = function () {
    $ionicNavBarDelegate.back();
  };

  $scope.Signup = function () {
    console.log('register');
    console.log($scope.register);

    $ionicLoading.show({
      template: 'Loading...'
    });

    UsersFactory.create($scope.register)
      .success(function (data) {
        console.log(data);
        if (data[0].success === false) {

          if (data[0].message.fullname) {
            $ionicPopup.alert({
              title: 'Error',
              template: data[0].message.fullname.msg
            });
            $ionicLoading.hide();
            return;
          } else if (data[0].message.areacode) {
            $ionicPopup.alert({
              title: 'Error',
              template: data[0].message.areacode.msg
            });
            return;
          } else if (data[0].message.mobile_number) {
            $ionicPopup.alert({
              title: 'Error',
              template: data[0].message.mobile_number.msg
            });
            $ionicLoading.hide();
            return;
          } else if (data[0].message.password) {
            $ionicPopup.alert({
              title: 'Error',
              template: data[0].message.password.msg
            });
            $ionicLoading.hide();
            return;
          } else if (data[0].message.confirmpassword) {
            $ionicPopup.alert({
              title: 'Error',
              template: data[0].message.confirmpassword.msg
            });
            $ionicLoading.hide();
            return;
          } else if ($scope.register.password != $scope.register.confirmpassword) {
            $ionicPopup.alert({
              title: 'Error',
              template: 'Password did not match!'
            });
            $ionicLoading.hide();
            return;
          } else if (data[0].message.email) {
            $ionicPopup.alert({
              title: 'Error',
              template: data[0].message.email.msg
            });
            $ionicLoading.hide();
            return;
          }
        } else {
          $ionicLoading.hide();
          $state.go('intro');
        }
      })
      .error(function (error) {
        console.log(error);
        $ionicLoading.hide();
      });
  };


};


Application.Controllers.controller('SignupCtrl', ['$scope', '$ionicNavBarDelegate', SignupCtrl]);
