
/**
 * Created by vasa on 26.06.14.
 */

(function () {
  'use strict';

  const GREEN = '#00A88D';
  const GREY = '#BABABA';
  const RED = '#F15A24';

  const RED_GRAD = 'url(#red_grad)';
  const GREEN_GRAD = 'url(#green_grad)';
  const GREY_GRAD = 'url(#grey_grad)';

  const directionTemplate = `<dl class="direction">
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

  const _phases = ['A', 'B', 'C'];
  const _contactors = [1, 2, 3, 4, 5, 6];
  const _directions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  function _icon() {
    const img = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    img.setAttribute('x', 0);
    img.setAttribute('y', 0);
    img.setAttribute('width', '14px');
    img.setAttribute('height', '14px');
    return img;
  }

  function alarmIconImage() {
    const img = _icon();
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/img/input14.png');
    return img;
  }

  function alarmGifImage() {
    const img = _icon();
    img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '/assets/img/input.gif');
    return img;
  }

  function controllerScheme($compile, Controllers, $rootScope) {
    return {
      scope    : {
        controller : '=controllerScheme'
      },
      link     : function (scope, element) {
        var translate;

        function drawDirection(phase, phaseElement, directionNum) {
          var directionElement = phaseElement.find('.direction-info.direction-info-' + directionNum);

          var direction = phase.direction(directionNum);

          if (!direction) {
            translate -= 25;
            return directionElement.hide();
          }

          var contactorIds = scope.controller.contactorIds();

          var idx = contactorIds.indexOf(direction.contactor_id) + 1;

          directionElement.find('.direction-contactor').css('opacity', 0);
          directionElement.find(`.direction-contactor-${idx}`).css('opacity', 1);

          var directionPoint = directionElement.find('circle.phase_dir');

          if (direction.isEnabled()) {
            directionPoint.css('fill', RED_GRAD);
          } else if (direction.monitorValue('.STATE') !== null) {
            directionPoint.css('fill', GREEN_GRAD);
          } else {
            directionPoint.css('fill', GREY_GRAD);
          }

          var svg = element.find('svg:first g#main-group');

          svg.find('image#direction_' + direction.id).remove();

          if (direction.isEmergency()) {
            var icon;

            if (direction.isSilent()) {
              icon = alarmIconImage();
            } else {
              icon = alarmGifImage();
            }

            icon.setAttribute('id', 'direction_' + direction.id);
            icon.setAttribute('x', directionPoint[0].cx.animVal.value);
            icon.setAttribute('y', directionPoint[0].cy.animVal.value - 13);

            svg[0].appendChild(icon);
          }
        }

        function drawPhase(phaseName) {
          var phaseElement = element.find('.phase.phase-' + phaseName);

          var phase = scope.controller.phase(phaseName);

          if (!phase) {
            return phaseElement.hide();
          }

          translate = 0;

          _directions.forEach(function (directionNum) {
            drawDirection(phase, phaseElement, directionNum);
          });
        }

        function drawPhaseInput(phaseName) {
          var inputElement = element.find('.phase-input.phase-input-' + phaseName);


          var phase = scope.controller.phase(phaseName);

          if (!phase) {
            return inputElement.css('fill', GREY_GRAD);
          }

          var input = phase.input();

          if (!input && scope.controller.type !== 'niitm') {
            return inputElement.css('fill', GREY_GRAD);
          }

          if (scope.controller.type === 'niitm') {
            return inputElement.css('fill', phase.inputEnabled() ? RED_GRAD : GREEN_GRAD);
          } else if (input.isEnabled()) {
            inputElement.css('fill', RED_GRAD);
          } else if (input.monitorValue('.STATE') !== null) {
            inputElement.css('fill', GREEN_GRAD);
          } else {
            inputElement.css('fill', GREY_GRAD);
          }

          var svg = element.find('svg:first g#main-group'),
            /*suffix = 'PHASE' + phaseName + '.FAULT',*/
            icon;

          svg.find('image#input_' + input.id).remove();
          /*if (phase.monitorValue(suffix) && phase.monitorIsEmergency(suffix) ) {

              icon = alarmIconImage();
              icon.setAttribute('id', 'input_' + input.id);
              icon.setAttribute('x', inputElement[0].cx.animVal.value);
              icon.setAttribute('y', inputElement[0].cy.animVal.value - 13);

              svg[0].appendChild(icon);
          } else */
            if (input.isEmergency()) {

            if (input.isSilent()) {
              icon = alarmIconImage();
            } else {
              icon = alarmGifImage();
            }

            icon.setAttribute('id', 'input_' + input.id);
            icon.setAttribute('x', inputElement[0].cx.animVal.value);
            icon.setAttribute('y', inputElement[0].cy.animVal.value - 13);

            svg[0].appendChild(icon);
          }
        }

        function drawPhaseFuse(phaseName) {
          var fuseElement = element.find('.phase-fuse.phase-fuse-' + phaseName);
          var phase = scope.controller.phase(phaseName);

          if (!phase) {
            return fuseElement.css('fill', GREY_GRAD);
          }

          var fuse = phase.fuse();

          if (!fuse) {
            return fuseElement.css('fill', GREY_GRAD);
          }

          var svg = element.find('svg:first g#main-group');

          svg.find('image#fuse_' + fuse.id).remove();

          if (fuse.isEnabled()) {
            fuseElement.css('fill', RED_GRAD);
          } else if (fuse.monitorKnown('.STATE')) {
            fuseElement.css('fill', GREEN_GRAD);
          } else {
            fuseElement.css('fill', GREY_GRAD);
          }

          if (fuse.isEmergency()) {
            var icon;

            if (fuse.isSilent()) {
              icon = alarmIconImage();
            } else {
              icon = alarmGifImage();
            }

            icon.setAttribute('id', 'fuse_' + fuse.id);
            icon.setAttribute('x', fuseElement[0].cx.animVal.value);
            icon.setAttribute('y', fuseElement[0].cy.animVal.value - 13);

            svg[0].appendChild(icon);
          }
        }

        function drawPhaseBlock(phaseName) {
          var phaseBlockElement = element.find('.phase-block.phase-block-' + phaseName);

          var phase = scope.controller.phase(phaseName);

          var svg = element.find('svg:first g#main-group');

          if (phase) {
            svg.find('image#block_' + phase.id).remove();
          }

          if (phase && phase.input() && phase.fuse() && phase.input().isEnabled() && phase.fuse().monitorKnown('.STATE') && !phase.fuse().isEnabled()) {

            var icon = alarmIconImage();

            var elemSvg = phaseBlockElement[0];

            icon.setAttribute('id', 'block_' + phase.id);
            icon.setAttribute('x', elemSvg.x.animVal.value + elemSvg.width.animVal.value - 7);
            icon.setAttribute('y', elemSvg.y.animVal.value - 7);

            svg[0].appendChild(icon);
          }
        }

        function drawContactor(contactorNum) {
          var contactorElement = element.find('.contactor-num.contactor-num-' + contactorNum);
          var contactor = scope.controller.contactor(contactorNum);

          element.find('.contactor-group.contactor-group-' + contactorNum).show();

          if (!contactor) {
            element.find('.contactor-group.contactor-group-' + contactorNum).hide();
          } else if (contactor.isEnabled()) {
            contactorElement.attr('fill', RED);
          } else if (contactor.monitorValue('.STATE') !== null) {
            contactorElement.attr('fill', GREEN);
          } else {
            contactorElement.attr('fill', GREY);
          }
        }

        function drawContactorMode(contactorNum) {
          var contactorModeElement = element.find('.contactor-mod-num.contactor-mod-num-' + contactorNum);

          var contactor = scope.controller.contactor(contactorNum);

          contactorModeElement.text(contactor ? contactor.regime() : 'не определено');
        }

        function drawContactorPhase(contactorNum, phaseName) {

          var contactorPhaseElement = element.find('.phase-contactor.phase-contactor-' + phaseName + '.phase-contactor-num-' + contactorNum);

          var phase = scope.controller.phase(phaseName);
          var contactor = scope.controller.contactor(contactorNum);

          if (!phase || !contactor) {
            return contactorPhaseElement.css('fill', GREY_GRAD);
          } else if (contactor && contactor.monitorValue('.STATE') === null) {
            return contactorPhaseElement.css('fill', GREY_GRAD);
          }

          var svg = element.find('svg:first g#main-group'),
            alarmName = 'alarm-phase-' + phaseName + '-contactor-' + contactorNum;
          svg.find('image#' + alarmName).remove();

          var suffix = `CONTACTOR0${contactorNum}.PHASE${phaseName}.STATE`;
          var monitor = _(contactor.controller.monitors).find((m) => m.tag.includes(suffix));

          if ( monitor && monitor.value === 0 && monitor.payload === 'emergency') {
            var icon;

            icon = alarmIconImage();
            //icon = alarmGifImage();
            icon.setAttribute('id', alarmName);
            icon.setAttribute('x', contactorPhaseElement[0].cx.animVal.value);
            icon.setAttribute('y', contactorPhaseElement[0].cy.animVal.value - 13);

            svg[0].appendChild(icon);
          }

          if (scope.controller.type === 'niitm') {
            contactorPhaseElement
                .css('fill', contactor.isEnabled() && !contactor.isEmergency() ? RED_GRAD : GREEN_GRAD);
          } else {
            contactorPhaseElement
                .css('fill', phase.input() && phase.input().isEnabled() && contactor.isEnabled() && !contactor.isEmergency() ? RED_GRAD : GREEN_GRAD);
          }
          let fuse = phase.fuse();

          if ( fuse && !fuse.isEnabled() && fuse.monitorKnown('.STATE') ) {
            contactorPhaseElement.css('fill', GREEN_GRAD);
          }
        }

        function drawKvit(idx) {
          var kvitElem = element.find('#kvit_' + idx);

          var kvit = scope.controller.kvit(idx);

          kvitElem.css('fill', kvit.isEnabled() ? RED_GRAD : GREEN_GRAD);
        }

        scope.$watch('controller', function (next) {
          if (angular.isObject(next)) {

            _phases.forEach(function (phaseName) {
              //вводы фаз
              drawPhaseInput(phaseName);

              //главные вставки
              drawPhaseFuse(phaseName);

              //блоки между входами и главными вставками
              drawPhaseBlock(phaseName);

              //фазы
              drawPhase(phaseName);
            });

            _contactors.forEach(function (contactorNum) {
              drawContactor(contactorNum);
              drawContactorMode(contactorNum);

              _phases.forEach(function (phaseName) {
                drawContactorPhase(contactorNum, phaseName);
              });
            });

            if (scope.controller.is_cascade) {
              element.find('#kvits').show();

              [0, 1].forEach(function (idx) {
                drawKvit(idx);
              });
            } else {
              element.find('#kvits').hide();
            }

            //описания направлений
            _directions.forEach(function (directionNum) {
              var $g = element.find('g.direction-info.direction-info-' + directionNum);

              var $child = scope.$new();
              $child.i = directionNum;
              var content = $compile(directionTemplate)($child);

              $g.on('mouseenter', function () {
                var $this = $(this);

                $this.find('circle[fill="#000000"]:first')
                    .popover({
                      title     : 'Направление ' + directionNum,
                      html      : true,
                      content   : content,
                      container : 'body',
                      placement : 'top'
                    })
                    .popover('show');
              }).on('mouseleave', function () {
                $(this).find('circle[fill="#000000"]').popover('destroy');
              });
            });

            // maintance Off
            var maintanceOffbutton = element.find('#maintance-off');
            maintanceOffbutton.on('click', function() {
                Controllers.maintenance_delete(
                  { controller : scope.controller.id }, { controller : scope.controller.id }).$promise
                    .then( () => { $rootScope.$broadcast('asuno-refresh-all'); });
            });

            //показатели
            if (!next.sensors.length) {
              element.find('#sensors').hide();
            } else {
              element.find('#sensors').show();
            }
          }
        }, true);

        scope.$on('$destroy', function () {
          element.find('image.svg-alarm-icon').remove();
        });
      }
    };
  }

  angular.module('asuno').directive('controllerScheme', controllerScheme);
})();
