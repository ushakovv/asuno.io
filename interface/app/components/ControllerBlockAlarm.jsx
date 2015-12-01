(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  class ControllerBlockAlarm extends React.Component {

    shouldComponentUpdate(nextProps) {
      return this.props.event !== nextProps.event;
    }

    render() {
      const { Monitors, event, src } = this.props;

      const classes = classNames('controller-alarm-icon', {
        'controller-alarm-icon--icon-active': Monitors.isActive(event)//,
        //'controller-alarm-icon--icon-active--nokvit': Monitors.isAfterKvit(event)
      });

      var url = src.split('-');
      var active = Monitors.isActive(event) ? '1' : '0';

      var _src = {
        backgroundImage: 'url(' + url[0] + '-' + active + '.png)'
      };

      return <div style={_src} className={classes}></div>;
    }
  }

  ControllerBlockAlarm.propTypes = {
    Monitors: React.PropTypes.object,
    event: React.PropTypes.array.isRequired,
    srcNokvit: React.PropTypes.string,
    srt: React.PropTypes.string
  };

  ControllerBlockAlarm.defaultProps = {
    event: []
  };

  R.ControllerBlockAlarm = R.ngInjectProps(ControllerBlockAlarm, ['Monitors']);
})();
