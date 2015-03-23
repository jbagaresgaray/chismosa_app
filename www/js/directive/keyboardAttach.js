
function keyboardAttachGetClientHeight(element) {
    return element.clientHeight
}


Application.Directive.directive('validFile', ['$parse', function($parse) {

    return function(scope, element, attrs) {
        window.addEventListener('native.showkeyboard', onShow);
        window.addEventListener('native.hidekeyboard', onHide);

        var scrollCtrl;

        function onShow(e) {
            //for testing
            var keyboardHeight = e.keyboardHeight || e.detail.keyboardHeight;
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

        scope.$on('$destroy', function() {
            window.removeEventListener('native.showkeyboard', onShow);
            window.removeEventListener('native.hidekeyboard', onHide);
        });
    };

}]);
