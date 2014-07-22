'use strict';

var SearchCtrl = function ($scope) {
  console.log('SearchCtrl');

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

  getContacts();
};

Application.Controllers.controller('SearchCtrl', ['$scope', SearchCtrl]);
