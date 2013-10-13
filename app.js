angular.module('ui.filters', []);
angular.module('ui.directives', []);
angular.module('ui', [
  'ui.filters', 
  'ui.directives'
]).value('ui.config', {});

function ctrl ($scope, $timeout) {
    $scope.isSelected = true;
    // $scope.isDisabled = false;
}

// -- GO

angular.module('ui.directives', []).directive('checkboxSwitch', function ($timeout) {
    return {
        template:
            '<div class="has-switch" data-ng-class="{ deactivate: ngDisabled }">' +
                '<div class="switch-wrapper switch-animate" data-ng-class="{ \'switch-on\': ngModel, \'switch-off\': !ngModel }">' +
                    '<input type="checkbox" data-ng-model="ngModel" />' +
                    '<span class="switch-left" data-ng-click="changeStatusTo(false)">{{switchOnLabel}}</span>' +
                    '<label>&nbsp;</label>' +
                    '<span class="switch-right" data-ng-click="changeStatusTo(true)">{{switchOffLabel}}</span>' +
                '</div>' +
            '</div>',
        restrict: 'A',
        require: '?ngModel',
        replace: true,
        scope: {
            ngModel: '=',
            ngDisabled: '=',
            switchOnLabel: '@cbSwitchOnLabel',
            switchOffLabel: '@cbSwitchOffLabel'
        },
        link: function postLink($scope, el) {

            var elLeft = el.find('span.switch-left'),
                elRight = el.find('span.switch-right'),
                elCursor = el.find('label'),
                elWrapper = el.find('.switch-wrapper');

            $scope.changeStatusTo = function(state) {
                if (!$scope.ngDisabled && state !== $scope.ngModel) {
                    $timeout(function() {
                        $scope.ngModel = state;
                    });
                }
            }

            elCursor.bind('mousedown touchstart', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                if ($scope.ngDisabled) {
                    return;
                }

                $scope.moving = false;
                elWrapper.removeClass('switch-animate');

                elCursor.bind('mousemove touchmove', function(e) {

                    var relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - el.offset().left,
                        percent = (relativeX / el.width()) * 100,
                        left = 25,
                        right = 75;

                      $scope.moving = true;

                      if (percent < left) {
                          percent = left;
                      } else if (percent > right) {
                          percent = right;
                      }

                      elWrapper.css('left', (percent - right) + "%");
                });               
                
                elCursor.on('mouseleave', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
  
                    elCursor.unbind('mouseleave mousemove touchmove mouseup touchend');

                    if ($scope.moving) {
                        $scope.changeStatusTo(!(parseInt(elWrapper.css('left')) < -25));
                    }

                    elWrapper.addClass('switch-animate');
                    elWrapper.css('left', '');
                });

                elCursor.on('mouseup touchend', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    elCursor.trigger('mouseleave');
                });
            });

            elCursor.bind('click', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                if (!$scope.moving) {
                    $scope.changeStatusTo(!$scope.ngModel);
                }
            });

        }
    };
});


angular.module('myApp', ['ui.directives']);