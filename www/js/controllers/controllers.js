'use strict';

var ctrl = angular.module('todo.controllers', []);

ctrl.controller('AppCtrl', function ($scope, $stateParams, $ionicModal, $ionicLoading, $location, $timeout, $ionicPopup,
  ContactsFactory, ChatsFactory, UsersFactory, NotifFactory) {

  console.log('AppCtrl');
  $scope.searchKey = "";

  console.log($scope.searchKey);

  var users = JSON.parse(window.localStorage['users'] || '{}');

  $scope.gotoProfile = function () {
    $location.path('/app/profile');
  }

  $scope.gotoContacts = function () {
    $location.path('/app/contact');
  }


  $ionicModal.fromTemplateUrl('templates/search.html', {
    scope: $scope
  }).then(function ($ionicModal) {
    $scope.searchmodal = $ionicModal;
  });
  $scope.openSearch = function () {
    console.log('openSearch');
    $scope.searchKey = "";
    $scope.users = {};
    getContacts();
    $scope.searchmodal.show();
  };
  $scope.closeSearch = function () {
    console.log('closeSearch');
    $scope.searchmodal.hide();
  };
  $scope.$on('$destroy', function () {
    $scope.searchmodal.remove();
  });

  $scope.logoutApp = function () {
    window.localStorage.removeItem("users");
    $location.path('/login');
  }

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

  function getUserProfile() {
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

  $scope.search = function (searchKey) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    console.log('search ctrl');

    $scope.searchKey = {};
    $scope.searchKey.searchKey = searchKey;
    $scope.searchKey.user_id = users.id;

    UsersFactory.search($scope.searchKey)
      .success(function (data) {
        console.log(data);
        $scope.users = {};
        if (data.length > 0) {
          if (data[0].success === false) {
            if (data[0].message.searchKey) {
              $ionicPopup.alert({
                title: 'Error',
                template: data[0].message.searchKey.msg
              });
              $ionicLoading.hide();
              return;
            }
          } else {
            $scope.users = data;
            console.log('users');
            console.log(data);
            $ionicLoading.hide();
          }
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: 'No record to display'
          });
        }
      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
      });
  };

  $scope.doRefreshSearch = function (searchKey) {
    console.log('Refreshing search!');

    $scope.searchKey = {};
    $scope.searchKey.searchKey = searchKey;
    $scope.searchKey.user_id = users.id;

    UsersFactory.search($scope.searchKey)
      .success(function (data) {
        console.log(data);
        $scope.users = {};
        if (data.length > 0) {
          if (data[0].success === false) {
            if (data[0].message.searchKey) {
              $ionicPopup.alert({
                title: 'Error',
                template: data[0].message.searchKey.msg
              });
              $ionicLoading.hide();
              return;
            }
          } else {
            $scope.users = data;
            console.log('users');
            console.log(data);
            $ionicLoading.hide();
          }
        } else {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: 'Error',
            template: 'No record to display'
          });
        }
      })
      .error(function (error) {
        console.log(error);
      })
      .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
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

  $scope.sendFriendRequest = function (receiver_id) {
    $scope.request = {};
    $scope.request.user_id = users.id;
    $scope.request.friend_id = receiver_id;
    console.log($scope.request);
    ContactsFactory.sendRequest($scope.request)
      .success(function (data) {
        console.log(data);
        if (data[0].success === true) {
          $ionicPopup.alert({
            title: 'Notification',
            template: data[0].message
          });
        } else {
          $ionicPopup.alert({
            title: 'Error',
            template: data[0].message
          });
        }

      })
      .error(function (error) {
        $ionicLoading.hide();
        console.log(error);
        $scope.status = 'Unable to load user chat history: ' + error.message;
      });
  }

  $scope.confirmRequest = function (notif) {
    console.log('confirmRequest');
    console.log(notif);

    $scope.friend = {};
    $scope.friend.friend_id = notif.user_id;
    $scope.friend.user_id = users.id;

    NotifFactory.read(notif)
      .success(function (data) {
        console.log(data);
        if (data[0].success === true) {
          ContactsFactory.confirmRequest($scope.friend)
            .success(function (result) {
              console.log(result);
              if (result[0].success === true) {
                getNotification();
              }
            })
            .error(function (error) {
              console.log(error);
            });
        }
      })
      .error(function (error) {
        console.log(error);
      });

  }

  $scope.denyRequest = function (notif_id) {
    console.log('denyRequest' + notif_id);
  }


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


  getUserProfile();
  getNotification();

});

ctrl.directive('keyboardAttach', function () {
  return function (scope, element, attrs) {
    window.addEventListener('native.showkeyboard', onShow);
    window.addEventListener('native.hidekeyboard', onHide);

    var scrollCtrl;

    function onShow(e) {
      //for testing
      var keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;
      //      element.css('bottom', keyboardHeight);
      element.css('bottom', keyboardHeight + 'px');
      scrollCtrl = element.controller('$ionicScroll');
      if (scrollCtrl) {
        scrollCtrl.scrollView.__container.style.bottom = keyboardHeight + keyboardAttachGetClientHeight(element[0]) + "px";
      }
    };

    function onHide() {
      element.css('bottom', '');
      if (scrollCtrl) {
        scrollCtrl.scrollView.__container.style.bottom = '';
      }
    };

    scope.$on('$destroy', function () {
      window.removeEventListener('native.showkeyboard', onShow);
      window.removeEventListener('native.hidekeyboard', onHide);
    });
  };
})

function keyboardAttachGetClientHeight(element) {
  return element.clientHeight
}
