(function () {
  'use strict';

  function ControllerCreator($log) {

    function _getPayloads(ids, monitors) {
      return _(monitors)
        .filter((m) => ids.includes(m.id))
        .map((m) => m.payload)
        .filter()
        .value();
    }

    const _phaseOrder = ['A', 'B', 'C'];

    // Отключаю проверку пока не обновится eslint
    /* eslint block-scoped-var: 0, no-unused-vars: 0*/

    class Node {
      constructor(node, controller) {
        Object.assign(this, node);

        this.controller = controller;
        this._monitorIds = this.structure ? this.structure.monitors : this.monitors;
        this._payloads = () => _getPayloads(this._monitorIds, this.controller.monitors);
      }

      monitorValue(suffix) {
        const monitor = this._findMonitor(suffix);
        if (!monitor) {
          $log.debug('NODE', this, `MONITOR NOT FOUND [${suffix}]`);
          return null;
        }

        return monitor.value;
      }

      monitorKnown(suffix) {
        const monitor = this._findMonitor(suffix);
        if (!monitor) {
          $log.debug('NODE', this, `MONITOR NOT FOUND [${suffix}]`);
          return false;
        }

        return !(monitor.value === null || new Date(monitor.last_reading_timestamp).getFullYear() === 1970);
      }

      isEnabled() {
        return this._hasPayload('enabled');
      }

      isEmergency() {
        return this._hasPayload('emergency');
      }

      isSilent() {
        const reading = this._findReading('emergency');
        return !reading || reading.silent;
      }

      _hasPayload(payload) {
        return this._payloads().indexOf(payload) >= 0;
      }

      _findReading(payload) {
        return _(this.controller.monitors)
          .filter((m) => this._monitorIds.includes(m.id))
          .find((m) => m.payload === payload);
      }

      _findMonitor(suffix) {
        return _(this.controller.monitors)
          .filter((m) => this._monitorIds.includes(m.id))
          .find((m) => m.tag.includes(suffix));
      }
    }

    class Input extends Node {
      isEnabled() {
        if (this.controller.type === 'dep') {
          return this.controller.monitorValue('LOSTU') !== 1 && Node.prototype.isEnabled.call(this);
        } else {
          return Node.prototype.isEnabled.call(this);
        }
      }

      isEmergency() {
        if (this.controller.type === 'dep') {
          return this.controller.monitorValue('LOSTU') === 1 || Node.prototype.isEmergency.call(this);
        } else {
          return Node.prototype.isEmergency.call(this);
        }
      }

      isSilent() {
        return true;
      }
    }

    class Fuse extends Node {
      constructor(input, phase, controller) {
        super(input, controller);
        this.phase = phase;
      }

      isEnabled() {
        if (this.controller.type === 'dep') {
          return this.controller.monitorValue('LOSTU') !== 1 && Node.prototype.isEnabled.call(this);
        } else if (this.controller.type === 'niitm') {
          return this.monitorValue('.STATE') === 0 || this.phase.inputEnabled() && this.monitorValue('STATE') === 5;
        } else {
          return super.isEnabled();
        }
      }
    }

    /**
     * @class Direction
     * @param {object} direction
     * @param {Controller} controller
     * @constructor
     * @description Направление на однолинейной схеме
     */
    class Direction extends Node {
      isEnabled() {
        if (this.controller.type === 'dep') {
          return this.controller.monitorValue('LOSTU') !== 1 && Node.prototype.isEnabled.call(this);
        } else if (this.controller.type === 'niitm') {
          return this.controller.isEnabled() && [0, 5].indexOf(this.monitorValue('STATE')) >= 0 || Node.prototype.isEnabled.call(this);
        } else {
          return Node.prototype.isEnabled.call(this);
        }
      }
    }

    Node.prototype.directionList = function () {
      const children = this.children || this.structure.children;

      return _(children || [])
        .filter((child) => child.type === 'direction')
        .map((direction) => new Direction(direction, this.controller || this))
        .value();
    };

    Node.prototype.direction = function (number) {
      return _(this.directionList())
        .find((dir) => dir.number === number);
    };

    /**
     * @class Phase
     * @param {object} phase
     * @param {Controller} controller
     * @constructor
     * @description Фаза на однолинейной схеме
     */
    class Phase extends Node {
      input() {
        return _(this.children)
          .filter((child) => child.type === 'input')
          .map((child) => new Input(child, this.controller))
          .first();
      }

      fuse() {
        return _(this.children)
          .filter((child) => child.type === 'fuse')
          .map((child) => new Fuse(child, this, this.controller))
          .first();
      }

      inputEnabled() {
        if (this.controller.type !== 'niitm') {
          $log.debug('Phase.inputEnabled on not NIITM controller!');
          return null;
        }

        return _(this.controller.phases())
          .map((phase) => phase.fuse())
          .any(function (fuse) {
            const state = fuse.monitorValue('.STATE');
            return state !== 2 && state !== 4;
          });
      }
    }

    class Contactor extends Node {
      regime() {
        if (this._hasPayload('manual')) {
          return 'ручной';
        } else if (this._hasPayload('autonomous')) {
          return 'автономный';
        } else if (this._hasPayload('by_address')) {
          return 'телеадресный';
        } else if (this._hasPayload('cascade')) {
          return 'телекаскадный';
        } else {
          return 'не определено';
        }
      }

      isEnabled() {
        if (this.controller.type === 'dep') {
          return this.controller.monitorValue('LOSTU') !== 1 && Node.prototype.isEnabled.call(this);
        } else if (this.controller.type === 'niitm') {
          return this.controller.isEnabled() && [1, 5].indexOf(this.monitorValue('STATE')) >= 0 || Node.prototype.isEnabled.call(this);
        } else {
          return Node.prototype.isEnabled.call(this);
        }
      }
    }

    class Controller extends Node {

      constructor(controller) {
        super(controller, controller);

        if (this.enabled) {
          this.night = this.enabled;
        } else {
          this.disabled = true;
        }

        const sensors = _.partition(this.sensors, function (sensor) {
          return !sensor.tag.includes('.DIMMER.VOLTAGE') &&
            !sensor.tag.includes('.CONNECTION.LEVEL') &&
            !sensor.tag.includes('.LAST_RESPONSE_TIME') &&
            !sensor.tag.includes('.BADTIMER');
        });

        this.sensors = sensors[0];
        this.other_sensors = sensors[1];

        var self = this;

        this.regime = function () {
          if (self.type === 'niitm') {
            switch (self.monitorValue('LIGHT')) {
              case 1:
                return 'ВЫКЛ';
              case 2:
                return 'ВЕЧЕР';
              case 3:
                return 'НОЧЬ';
              case 4:
                return 'ВЕЧЕР+ПОДСВЕТКА';
              default:
                return 'НЕ ОПРЕДЕЛЕНО';
            }
          } else if (self.enabled) {
            return 'НОЧЬ';
          } else {
            return 'ВЫКЛ';
          }
        };

        this.contactors = function () {
          return _(self.structure.children)
            .filter((child) => child.type === 'contactor')
            .map((contactor) => new Contactor(contactor, self))
            .value();
        };

        this.contactor = function (number) {
          return _(self.contactors())
            .filter((contactor) => contactor.number === number)
            .first();
        };

        this.contactorIds = function () {
          return _(self.contactors())
            .map((contactor) => contactor.id);
        };

        this._phases = function () {
          const children = self.type === 'ahp_kulon' ? _.find(self.structure.children, (c) => c.name === 'ШУНО').children : self.structure.children;

          return _(children)
            .filter((child) => child.type === 'phase')
            .map((phase) => new Phase(phase, self))
            .value();
        };

        this.phase = function (phaseName) {
          return _(self._phases())
            .find((phase) => phase.phase === phaseName);
        };

        this.phases = function () {
          return _(_phaseOrder)
            .map((name) => self.phase(name));
        };

        this.kvits = function () {
          return _(self.structure.children)
            .filter((child) => child.type === 'kvit')
            .map((child) => new Node(child, self))
            .value();
        };

        this.kvit = function (idx) {
          return self.kvits()[idx];
        };

        this.isMaintenance = function () {
          return self.maintenance && moment().isBetween(self.maintenance.date_from, self.maintenance.date_to);
        };

        this.monitor = function (id) {
          return _.find(self.monitors, (m) => m.id === id);
        };

        this.sensorValue = (suffix) => {
          const sensor = _(this.sensors.concat(this.other_sensors))
            .find((sensor) => sensor.tag.includes(suffix));

          return sensor ? sensor.current_reading : void 0;
        };

        this.monitorValue = Node.prototype.monitorValue.bind(this);
        this.isEnabled = Node.prototype.isEnabled.bind(this);
        this.directionList = Node.prototype.directionList.bind(this);
        this.direction = Node.prototype.direction.bind(this);
      }
    }

    this.createController = function (controller) {
      return new Controller(controller);
    };

    this.copyController = (controller) => {
      const oldController = angular.copy(controller);
      oldController.sensors = oldController.sensors.concat(oldController.other_sensors);
      return this.createController(oldController);
    };
  }

  angular.module('asuno.services').service('ControllerCreator', ControllerCreator);
})();
