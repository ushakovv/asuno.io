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
           compareEvents(prev.alarms.manual, next.alarms.manual) &&
           compareEvents(prev.alarms.common_alarm, next.alarms.common_alarm);
  }

  function isDisconnected(controller) {
    return _.any(controller.alarms.connection, (monitor) => monitor.payload === 'emergency');
  }
  function isCommonAlarmHere(controller) {
    return _.any(controller.alarms.common_alarm, (monitor) => monitor.payload === 'emergency');
  }

  class ControllerBlock extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.handleSelection = this.handleSelection.bind(this);
      this.handleBlockSelect = this.handleBlockSelect.bind(this);
      this.handleBlockClick = this.handleBlockClick.bind(this);

      this.state = {
        is_selected : this.props.ControllersStore.isControllerSelected(this.props.controller.id)
      };
    }

    componentDidMount() {
      this.props.ControllersStore.addListener(this.props.EmitEvents.CONTROLLER_SELECTION, this.handleSelection);
    }

    handleSelection() {
      this.setState({is_selected : this.props.ControllersStore.isControllerSelected(this.props.controller.id)});
    }

    handleBlockSelect(e) {
      e.stopPropagation();
      this.props.ControllersActions.toggleControllerSelection(!this.state.is_selected, this.props.controller.id);
    }

    handleBlockClick(e) {
      e.preventDefault();
      this.props.choose(this.props.controller);
    }

    shouldComponentUpdate(nextProps, nextState) {
      var controller = this.props.controller;
      var next = nextProps.controller;
      var result = compareControllers(controller, next) && this.state.is_selected === nextState.is_selected;
      return !result;
    }

    render() {
      const { controller, STATUS_ICONS } = this.props;

      const icons = STATUS_ICONS.map((icon) => {
        const event = controller.alarms[icon.key];
        return <div className="controller__alarm" key={icon.key}>
            <R.ControllerBlockAlarm src={icon.srcSm} srcNokvit={icon.srcNokvit} event={event} key={icon.key} />
          </div>;
      });

      const isMaintenance = controller.isMaintenance();

      const controllerClasses = classNames('controller', {
        'controller--emergency'      : controller.sort_group == "emergency",
        'controller--enabled'      : controller.enabled,
        'controller--disabled'     : !controller.enabled,
        'controller--disconnected' : isDisconnected(controller),
        'controller--common_alarm' : isCommonAlarmHere(controller),
        'controller--cascade'      : controller.is_cascade,
        'controller--maintenance'  : isMaintenance,
        'controller--description'  : controller.description,
        'controller--autonomous'   : controller.is_autonomous
      });

      const containerClasses = classNames('controller-container parent', {
        'tooltipped tooltipped-n'     : isMaintenance || controller.description
      });

      let iconTypeUI;
      if (controller.type == 'dep') {
        iconTypeUI = <div className="controller__alarm controller--dep" >
          <img src="/assets/img/d-lit.png" class="controller-alarm-icon" />
        </div>;
      } else if(controller.type == 'niitm') {
        iconTypeUI = <div className="controller__alarm controller--niitm" >
          <img src="/assets/img/n-lit.png" class="controller-alarm-icon" />
        </div>;
      }

      let iconСascadeUI;
      if (controller.is_cascade) {
        iconСascadeUI = <span className="controller--cascade" ></span>;
      } else {
        iconСascadeUI = '';
      }


      let tooltip;
      if (controller.description) {
        tooltip = controller.description;
      } else if (isMaintenance) {
        tooltip = 'Профилактика с ' + moment(controller.maintenance.date_from).format('DD.MM.YYYY HH:mm') + ' по ' + moment(controller.maintenance.date_to).format('DD.MM.YYYY HH:mm');
      }

      return <div className={containerClasses} data-tooltip={tooltip} onClick={this.handleBlockClick} data-id={this.props.controller.id}>
          <div className={controllerClasses}>
            {iconСascadeUI}
            <div className="controller__name">
              <input type="checkbox" className="controller__name__selector" checked={this.state.is_selected} readOnly={true} onClick={this.handleBlockSelect}/>
              <a href={this.props.controller.href} className="controller__name__link">{controller.name}</a>
            </div>
            <div className="controller__icons">
              {iconTypeUI}
              {icons}
            </div>
            <a href={this.props.controller.href} className="controller__address">
              {controller.address}
            </a>
          </div>
        </div>;
    }

    componentWillUnmount() {
      this.props.ControllersStore.removeListener(this.props.EmitEvents.CONTROLLER_SELECTION, this.handleSelection);
    }
  }

  ControllerBlock.propTypes = {
    choose: React.PropTypes.func.isRequired,
    controller: React.PropTypes.object.isRequired,
    ControllersStore: React.PropTypes.object.isRequired,
    ControllersActions: React.PropTypes.object.isRequired,
    EmitEvents: React.PropTypes.object.isRequired,
    STATUS_ICONS: React.PropTypes.array.isRequired
  };

  R.ControllerBlock = R.ngInjectProps(ControllerBlock, ['ControllersStore', 'ControllersActions', 'EmitEvents', 'STATUS_ICONS']);
})();
