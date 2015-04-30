(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  R.Controllers = React.createClass({
    mixins                : [R.ngInjectMixin(React)],
    propTypes             : {
      choose : React.PropTypes.func.isRequired
    },
    getInitialState       : function () {
      this.EE = this.ngInject('EmitEvents');
      this.ControllersStore = this.ngInject('ControllersStore');
      this.CondenseStore = this.ngInject('CondenseStore');

      return {
        controllers : this.ControllersStore.getControllers(),
        condensed   : this.CondenseStore.isCondensed()
      };
    },
    componentDidMount     : function () {
      this.ControllersStore.addListener(this.EE.CONTROLLERS_CHANGE, this._changeCallback);
      this.CondenseStore.addChangeListener(this._changeCondense);
    },
    componentWillUnmount  : function () {
      this.ControllersStore.removeListener(this.EE.CONTROLLERS_CHANGE, this._changeCallback);
      this.CondenseStore.removeChangeListener(this._changeCondense);
    },
    shouldComponentUpdate : function (nextProps, nextState) {
      return nextState.controllers !== this.state.controllers || nextState.condensed !== this.state.condensed;
    },
    render                : function () {
      var controllers = this.state.controllers.map(function (ctrl) {
        return <R.ControllerBlock ngInjector={this.props.ngInjector} controller={ctrl} choose={this.props.choose} key={ctrl.id}/>;
      }, this);

      var classes = classNames('row controller-list', {
        'controller-list--condensed' : this.state.condensed
      });

      return <div className="col-lg-12">
          <div className={classes}>
            {controllers}
          </div>
        </div>;
    },
    _changeCondense       : function () {
      this.setState({condensed : this.CondenseStore.isCondensed()});
    },
    _changeCallback       : function () {
      this.setState({
        controllers : this.ControllersStore.getControllers()
      });
    }
  });
})();
