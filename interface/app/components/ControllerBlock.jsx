(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  function compareEvents(prev, next) {
    if (prev !== next && (next === null || prev === null)) {
      return false;
    } else if (prev === next) {
      return true;
    } else {
      return angular.equals(prev, next);
    }
  }

  function compareControllers(prev, next) {
    return prev.enabled === next.enabled && prev.name === next.name && prev.address === next.address &&
           next.maintenance === prev.maintenance && next.description === prev.description &&
           compareEvents(prev.alarms.fire, next.alarms.fire) &&
           compareEvents(prev.alarms.door, next.alarms.door) &&
           compareEvents(prev.alarms.connection, next.alarms.connection) &&
           compareEvents(prev.alarms.block, next.alarms.block) &&
           compareEvents(prev.alarms.common_alarm, next.alarms.common_alarm);
  }

  function isDisconnected(controller) {
    return _.any(controller.alarms.connection, (monitor) => monitor.payload === 'emergency');
  }

  window.REACT.ControllerBlock = React.createClass({
    mixins                : [R.ngInjectMixin(React)],
    propTypes             : {
      choose     : React.PropTypes.func.isRequired,
      controller : React.PropTypes.object.isRequired
    },
    getInitialState       : function () {
      this.ControllersStore = this.ngInject('ControllersStore');
      this.ControllersActions = this.ngInject('ControllersActions');
      this.EE = this.ngInject('EmitEvents');

      return {is_selected : this.ControllersStore.isControllerSelected(this.props.controller.id)};
    },
    handleBlockSelect     : function (e) {
      e.stopPropagation();
      this.ControllersActions.toggleControllerSelection(!this.state.is_selected, this.props.controller.id);
    },
    handleBlockClick      : function () {
      this.props.choose(this.props.controller);
    },
    componentDidMount     : function () {
      this.ControllersStore.addListener(this.EE.CONTROLLER_SELECTION, this._handleSelection);
    },
    componentWillUnmount  : function () {
      this.ControllersStore.removeListener(this.EE.CONTROLLER_SELECTION, this._handleSelection);
    },
    shouldComponentUpdate : function (nextProps, nextState) {
      var controller = this.props.controller;
      var next = nextProps.controller;
      var result = compareControllers(controller, next) && this.state.is_selected === nextState.is_selected;
      return !result;
    },
    render                : function () {
      var controller = this.props.controller;

      var icons = this.ngInject('STATUS_ICONS').map(function (icon) {
        var event = controller.alarms[icon.key];
        return <div className="controller__alarm" key={icon.key}>
            <R.ControllerBlockAlarm src={icon.srcSm} srcNokvit={icon.srcNokvit} event={event} ngInjector={this.props.ngInjector}/>
          </div>;
      }, this);

      var isMaintenance = controller.isMaintenance();

      var controllerClasses = classNames('controller', {
        'controller--enabled'      : controller.enabled,
        'controller--disabled'     : !controller.enabled,
        'controller--disconnected' : isDisconnected(controller),
        'controller--cascade'      : controller.is_cascade,
        'controller--maintenance'  : isMaintenance,
        'controller--description'  : controller.description,
        'controller--autonomous'   : controller.is_autonomous
      });

      var containerClasses = classNames('controller-container parent', {
        'tooltipped tooltipped-n'     : isMaintenance || controller.description
      });

      var tooltip;
      if (controller.description) {
        tooltip = controller.description;
      } else if (isMaintenance) {
        tooltip = 'Профилактика с ' + moment(controller.maintenance.date_from).format('DD.MM.YYYY HH:mm') + ' по ' + moment(controller.maintenance.date_to).format('DD.MM.YYYY HH:mm');
      }

      return <div className={containerClasses} data-tooltip={tooltip} onClick={this.handleBlockClick} data-id={this.props.controller.id}>
          <div className={controllerClasses}>
            <div className="controller__name">
              <input type="checkbox" className="controller__name__selector" checked={this.state.is_selected} readOnly={true} onClick={this.handleBlockSelect}/>
              {controller.name}
            </div>
            <div className="controller__address">
              {controller.address}
            </div>
            <div className="controller__icons">
              {icons}
            </div>
          </div>
        </div>;
    },
    _handleSelection      : function () {
      this.setState({is_selected : this.ControllersStore.isControllerSelected(this.props.controller.id)});
    }
  });
})();
