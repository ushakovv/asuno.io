(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  R.ControllerBlockAlarm = React.createClass({
    mixins                : [R.ngInjectMixin(React)],
    getDefaultProps       : function () {
      return {event: []};
    },
    getInitialState       : function () {
      this.Monitors = this.ngInject('Monitors');
      return {};
    },
    render                : function () {
      var classes = classNames('controller-alarm-icon', {
        'controller-alarm-icon--icon-active'         : this.Monitors.isActive(this.props.event),
        'controller-alarm-icon--icon-active--nokvit' : this.Monitors.isAfterKvit(this.props.event)
      });

      var src = this.props.isAfterKvit ? this.props.srcNokvit : this.props.src;

      return <img src={src} className={classes} />;
    }
  });
})();
