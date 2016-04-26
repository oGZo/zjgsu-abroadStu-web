define(function () {
    var app = angular.module('Animations', []);

    app.animation('.menu', function () {

        var animateShow = function (element, className, done) {
            if (className != 'active') {
                return;
            }

            jQuery(element).show(done);

            return function (cancel) {
                if (cancel) {
                    element.stop();
                }
            };
        }

        var animateHide = function (element, className, done) {
            if (className != 'active') {
                return;
            }
            jQuery(element).show(done);

            return function (cancel) {
                if (cancel) {
                    element.stop();
                }
            };
        }

        return {
            addClass: animateShow,
            removeClass: animateHide
        };
    })
    app.directive('my97datepicker', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                minDate: '@',
                maxDate : '@'
            },
            link: function (scope, element, attr, ngModel) {
                //console.log(attr);
                var value = ngModel.$viewValue;
                var datefmt = attr.datefmt||'yyyy-MM-dd';
                element.val(value);
                function onpicking(dp) {
                    var date = dp.cal.getNewDateStr();
                    scope.$apply(function () {
                        ngModel.$setViewValue(date);
                    });
                }
                function onpicked(dp) {
                    var date = dp.cal.getNewDateStr();
                    scope.$apply(function () {
                        ngModel.$setViewValue(date);
                    });
                }
                function onclearing(dp) {
                    var date = dp.cal.getNewDateStr();
                    scope.$apply(function () {
                        ngModel.$setViewValue('');
                    });
                }
                function oncleared(dp) {
                    var date = dp.cal.getNewDateStr();
                    scope.$apply(function () {
                        ngModel.$setViewValue('');
                    });
                }
                element.bind('click', function () {
                    WdatePicker({
                        onpicking: onpicking,
                        onpicked: onpicked,
                        onclearing : onclearing,
                        oncleared : oncleared,
                        dateFmt: datefmt,
                        errDealMode : 1,
                        minDate: (attr.mindate || ''),
                        maxDate: (attr.maxdate || ''),
                    })
                });
            }
        };
    });
});
