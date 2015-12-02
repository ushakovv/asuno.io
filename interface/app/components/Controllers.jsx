(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  const CONTROLLER_TYPES = {
    'dep': 'ДЭП',
    'niitm': 'НИИТМ',
    'ahp_saturn': 'Сатурн (АХП)',
    'ahp_kulon': 'Кулон (АХП)',
    'grs_kulon': 'Кулон (ГР)',
    'emergency': 'Авария',
    'off': 'Отключено',
    'on': 'Включено'

  };

  class ControllersList extends React.Component {
    shouldComponentUpdate(nextProps) {
      return nextProps.controllers !== this.props.controllers;
    }

    render() {
      const { controllers, choose } = this.props;
      const { ngInjector } = this.context;

      const controllerBlocks = controllers
        .map((ctrl) => <R.ControllerBlock ngInjector={ngInjector} controller={ctrl} choose={choose} key={ctrl.id} />);

      return <div>
        {controllerBlocks}
      </div>;
    }
  }

  ControllersList.propTypes = {
    controllers: React.PropTypes.array.isRequired,
    choose : React.PropTypes.func.isRequired
  };

  ControllersList.contextTypes = {
    ngInjector: React.PropTypes.object.isRequired
  };

  class ControllerTypeBlock extends React.Component {
    constructor(props) {
      super(props);

      this.toggleExpand = this.toggleExpand.bind(this);

      this.state = {
        isExpanded: true
      };
    }

    toggleExpand() {
      this.setState({isExpanded: !this.state.isExpanded});
    }

    render() {
      const { controllers, choose } = this.props;
      const { isExpanded } = this.state;

      const indicatorClassName = classNames('controller-list__type-name__handle fa', {
        'fa-angle-down': isExpanded,
        'fa-angle-right': !isExpanded
      });

      return <div className="clearfix controller-list__type">
        <h5 className="controller-list__type-name" onClick={this.toggleExpand}>
          <span className={indicatorClassName}></span>
          {`${CONTROLLER_TYPES[this.props.type] || this.props.type} (${this.props.controllers.length})`}
        </h5>

        <div style={{display: isExpanded ? 'block' : 'none'}}>
          <ControllersList isExpanded={isExpanded} controllers={controllers} choose={choose} />
        </div>
      </div>;
    }
  }

  ControllerTypeBlock.propTypes = {
    controllers: React.PropTypes.array.isRequired,
    choose : React.PropTypes.func.isRequired
  };

  class Controllers extends React.Component {
    constructor(props, context) {
      super(props, context);

      const { ControllersStore, CondenseStore } = this.props;

      this.handleChangeControllers = this.handleChangeControllers.bind(this);
      this.handleChangeCondense = this.handleChangeCondense.bind(this);

      this.state = {
        controllers: ControllersStore.getSortControllers(),
        condensed: CondenseStore.isCondensed()
      };
    }

    componentDidMount() {
      const { ControllersStore, CondenseStore, EmitEvents } = this.props;

      ControllersStore.addListener(EmitEvents.CONTROLLERS_CHANGE, this.handleChangeControllers);
      CondenseStore.addChangeListener(this.handleChangeCondense);
    }

    shouldComponentUpdate(nextProps, nextState) {
      return nextState.controllers !== this.state.controllers || nextState.condensed !== this.state.condensed;
    }

    handleChangeCondense() {
      this.setState({
        condensed : this.props.CondenseStore.isCondensed()
      });
    }

    handleChangeControllers() {
      this.setState({
        controllers : this.props.ControllersStore.getSortControllers()
      });
    }

    render() {
      const controllers = _.map(this.state.controllers, (controllerList, sort_group) => {
        return <ControllerTypeBlock {...this.props} type={sort_group} controllers={controllerList} key={sort_group} />;
      });

      var classes = classNames('row controller-list', {
        'controller-list--condensed' : this.state.condensed
      });

      return <div className="col-lg-12">
          <div className={classes}>
            {controllers}
          </div>
        </div>;
    }

    componentWillUnmount() {
      const { ControllersStore, CondenseStore, EmitEvents } = this.props;

      ControllersStore.removeListener(EmitEvents.CONTROLLERS_CHANGE, this.handleChangeControllers);
      CondenseStore.removeChangeListener(this.handleChangeCondense);
    }
  }

  R.Controllers = R.ngInjectProps(Controllers, ['ControllersStore', 'CondenseStore', 'EmitEvents']);

})();
