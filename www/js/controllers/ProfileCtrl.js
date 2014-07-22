'use strict';

var ProfileCtrl = function ($scope, $ionicPopup, $ionicLoading,$location, UsersFactory) {
  console.log('ProfileCtrl');

  var users = JSON.parse(window.localStorage['users'] || '{}');

  $scope.showName = function () {
    $scope.profile = users;
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="profile.name">',
      title: 'Set Name',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function (e) {
          if (!$scope.profile.name) {
            e.preventDefault();
          } else {
              saveName();
          }
        }
            }, ]
    });
  };
  $scope.showPicOption = function () {
    $scope.profile = users;
    var myPopup = $ionicPopup.show({
      template: '<div class="list">\
                <a class="item" ng-click="showProfilePic()">Profile Photo</a>\
                <a class="item" ng-click="showCoverPic()">Cover Photo</a>\
                </div>',
      title: 'Set Profile/Cover Photo',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }]
    });
  };
  $scope.showProfilePic = function () {
    $scope.profile = users;
    var myPopup = $ionicPopup.show({
      template: '<div class="list">\
                <a class="item item-icon-left"><i class="icon ion-camera"></i>Camera</a>\
                <a class="item item-icon-left"><i class="icon ion-images"></i>Gallery</a>\
                <a class="item item-icon-left"><i class="icon ion-close-round"></i>Remove</a>\
                </div>',
      title: 'Set Profile Photo',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }]
    });
  };
  $scope.showCoverPic = function () {
    $scope.profile = users;
    var myPopup = $ionicPopup.show({
      template: '<div class="list">\
                <a class="item item-icon-left"><i class="icon ion-camera"></i>Camera</a>\
                <a class="item item-icon-left"><i class="icon ion-images"></i>Gallery</a>\
                <a class="item item-icon-left"><i class="icon ion-close-round"></i>Remove</a>\
                </div>',
      title: 'Set Cover Photo',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }]
    });
  };
  $scope.showStatus = function () {
    $scope.profile = users;
    console.log(users);
    var myPopup = $ionicPopup.show({
      template: '<textarea id="message" ng-model="profile.message_status" style="overflow:hidden;height:80px;" ng-trim="false" maxlength="450" row="4" column="10"></textarea>\
                    <span>{{200 - profile.message_status.length}}</span>',
      title: 'Set Status',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
            }, {
        text: '<b>Delete</b>',
        type: 'button-assertive',
            }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function (e) {
          if (!$scope.profile.message_status) {
            e.preventDefault();
          } else {
            saveStatus();
          }
        }
            }, ]
    });
  };
  $scope.showMobile = function () {
    $scope.profile = users;
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="profile.mobile_number">',
      title: 'Edit Mobile Number',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.profile.mobile_number) {
              e.preventDefault();
            } else {
              saveMobileNumber();
            }
          }
        }, ]
    });
  };
  $scope.showEmail = function () {
    $scope.profile = users;
    var myPopup = $ionicPopup.show({
      template: '<input type="email" ng-model="profile.email">',
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
            if (!$scope.profile.email) {
              e.preventDefault();
            } else {
              saveEmail();
            }
          }
            }, ]
    });
  };

  $scope.refresh = function () {
    console.log('refresh');
    $ionicLoading.show({
      template: 'Loading...'
    });
    UsersFactory.show(users.id)
      .success(function (data) {
        console.log(data);

        $scope.profile = data[0].users[0];

        window.localStorage.removeItem("users");
        window.localStorage['users'] = JSON.stringify(data[0].users[0]);

        getUserProfile();

        $ionicLoading.hide();
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load customer data: ' + error.message;
      });
  };

  function getUserProfile() {
    console.log('getUserProfile');
    $ionicLoading.show({
      template: 'Loading...'
    });
    $scope.profile = users;
    if (users.pic_blob) {
      $scope.profilePic = "data:image/png;base64," + (users.pic_blob);
    } else {
      $scope.profilePic = "img/photo.png";
    }
    $ionicLoading.hide();
  }

  function saveName() {
    console.log('saveName');
    $ionicLoading.show({
      template: 'Loading...'
    });
    $scope.profile.user_id = users.id;
    UsersFactory.updateName($scope.profile)
      .success(function (res) {
        console.log(res);
        if (res[0].success == true) {
          $ionicPopup.alert({
            title: 'Updated',
            template: res[0].message
          });

          $scope.refresh();

          $location.path('/app/profile');
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: res[0].message
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
  }

  function saveStatus() {
    console.log('saveStatus');
    $ionicLoading.show({
      template: 'Loading...'
    });
    UsersFactory.updateStatus($scope.profile)
      .success(function (res) {
        console.log(res);
        if (res[0].success == true) {
          $ionicPopup.alert({
            title: 'Posted',
            template: res[0].message
          });
          $scope.refresh();
          $location.path('/app/profile');
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: res[0].message
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
  }

  function saveMobileNumber() {
    console.log('saveMobileNumber');
    $ionicLoading.show({
      template: 'Loading...'
    });
    UsersFactory.updateNumber($scope.profile)
      .success(function (res) {
        console.log(res);
        if (res[0].success == true) {
          $ionicPopup.alert({
            title: 'Updated',
            template: res[0].message
          });
          $scope.refresh();

          $location.path('/app/profile');
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: res[0].message
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
  }

  function saveEmail() {
    console.log('saveEmail');
    $ionicLoading.show({
      template: 'Loading...'
    });
    UsersFactory.updateEmail($scope.profile)
      .success(function (res) {
        console.log(res);
        if (res[0].success == true) {
          $ionicPopup.alert({
            title: 'Updated',
            template: res[0].message
          });
          $scope.refresh();

          $location.path('/app/profile');
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: res[0].message
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
  }

  getUserProfile();
};

Application.Controllers.controller('ProfileCtrl', ['$scope', '$ionicPopup', '$ionicLoading','$location', 'UsersFactory', ProfileCtrl]);
