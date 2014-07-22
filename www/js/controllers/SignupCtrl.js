'use strict';

var SignupCtrl = function ($scope, $ionicNavBarDelegate) {
  console.log('SignupCtrl');
  $scope.goBack = function () {
    $ionicNavBarDelegate.back();
  }
};


Application.Controllers.controller('SignupCtrl', ['$scope', '$ionicNavBarDelegate', SignupCtrl]);
