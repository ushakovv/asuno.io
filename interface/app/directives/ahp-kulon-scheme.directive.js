(function () {
  'use strict';

  var RED_GRAD = 'url(#red_grad)';
  var GREEN_GRAD = 'url(#green_grad)';
  var GREY_GRAD = 'url(#grey_grad)';

  var directionTemplate = `<dl class="direction">
                            <dt class="direction__info">Py, кВт</dt>
                            <dd class="direction__value" ng-bind="controller.directions[i-1].p_u"></dd>
                            <dt class="direction__info">Ip, A</dt>
                            <dd class="direction__value" ng-bind="controller.directions[i-1].i_p"></dd>
                            <dt class="direction__info">Iyt, mA</dt>
                            <dd class="direction__value" ng-bind="controller.directions[i-1].i_ut"></dd>
                            <dt class="direction__info">Напр. линии</dt>
                            <dd class="direction__value" ng-bind="controller.directions[i-1].direction"></dd>
                            <dt class="direction__info">Осв. приборы</dt>
                            <dd class="direction__value" ng-bind="controller.directions[i-1].lightning"></dd>
                          </dl>`;

  var _phases = ['A', 'B', 'C'];
  var _directions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  let _isSeconPartDirectionsOn = false;

  function _icon() {
    var img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttribute('x', 0);
    img.setAttribute('y', 0);
    img.setAttribute('width', '14px');
    img.setAttribute('height', '14px');
    return img;
  }

  function alarmIconImage() {
    var img = _icon();
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/img/input14.png');
    return img;
  }

  function alarmGifImage() {
    var img = _icon();
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/img/input.gif');
    return img;
  }

  angular.module('asuno')
    .directive('ahpKulonScheme', function ahpKulonScheme($compile) {
      return {
        scope: {
          controller: '=ahpKulonScheme'
        },
        link: function (scope, element) {
          function drawPhase(phaseName) {
            var phaseElement = element.find(`.phase.phase-${phaseName}`);
            var phase = scope.controller.phase(phaseName);

            if (!phase) {
              return phaseElement.css('fill', GREY_GRAD);
            }

            phaseElement.css('fill', phase.isEnabled() ? RED_GRAD : GREEN_GRAD);

            var svg = element.find('svg:first g#main-group');

            svg.find(`image#phase_${phase.id}`).remove();

            if (phase.isEmergency()) {
              var icon;

              if (phase.isSilent()) {
                icon = alarmIconImage();
              } else {
                icon = alarmGifImage();
              }

              icon.setAttribute('id', `phase_${phase.id}`);
              icon.setAttribute('x', phaseElement[0].cx.animVal.value);
              icon.setAttribute('y', phaseElement[0].cy.animVal.value - 13);

              svg[0].appendChild(icon);
            }
          }

          function drawDirection(directionNum) {
            var directionElement = element.find(`.direction.direction-${directionNum}`);
            var direction = scope.controller.direction(directionNum);

            if (direction) {
              directionElement.show();

              if (directionNum > 8) {
                _isSeconPartDirectionsOn = true;
              }
            } else {
              directionElement.hide();
            }
          }

          function drawDirectionInfo(directionNum) {
            var $g = element.find(`.direction.direction-${directionNum}`);

            var $child = scope.$new();
            $child.i = directionNum;
            var content = $compile(directionTemplate)($child);

            $g.on('mouseenter', function () {
              var $this = $(this);

              $this.find(`circle.direction-info.direction-info-${directionNum}`)
                .popover({
                  title     : 'Направление ' + directionNum,
                  html      : true,
                  content   : content,
                  container : 'body',
                  placement : 'top'
                })
                .popover('show');
            }).on('mouseleave', function () {
              $(this).find(`circle.direction-info.direction-info-${directionNum}`).popover('destroy');
            });
          }

          function toggleSvgHeight(){
            const svg = element.find('svg:first');
            const mainLineGroup = element.find('.main-line-second-group');
            let viewBoxValue = '0 131 800 300';
            mainLineGroup.each((k, line) => {
              line.setAttribute('style', 'display: none;');
            });

            if ( _isSeconPartDirectionsOn ) {
              viewBoxValue = '0 131 800 600';
              mainLineGroup.each((k, line) => {
                line.setAttribute('style', 'display: block;');
              });
            }
            svg[0].setAttribute('viewBox', viewBoxValue);
          }

          scope.$watch('controller', function (next) {
            if (angular.isObject(next)) {
              _phases.forEach(drawPhase);

              _isSeconPartDirectionsOn = false;

              _directions.forEach(drawDirection);
              _directions.forEach(drawDirectionInfo);

              toggleSvgHeight();
            }
          }, true);

          scope.$on('$destroy', () => element.find('image.svg-alarm-icon').remove());
        }
      };
    });
})();
