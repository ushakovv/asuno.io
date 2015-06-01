(function () {
  'use strict';

  function fill(value) {
    return value < 10 ? '0' + value : value;
  }

  const R = window.REACT = window.REACT || {};

  class Clock extends React.Component {

    constructor(props) {
      super(props);

      this.getTime = this.getTime.bind(this);
      this.updateTs = this.updateTs.bind(this);

      this.state = this.getTime();
    }

    getTime() {
      return {timestamp : this.props.ClockStore.getTime()};
    }

    componentWillMount() {
      this.reload = setInterval(this.updateTs, 1000);
    }

    updateTs() {
      this.setState(this.getTime());
    }

    render() {
      const hours = fill(this.state.timestamp.getHours());
      const minutes = fill(this.state.timestamp.getMinutes());
      const seconds = fill(this.state.timestamp.getSeconds());
      const date = fill(this.state.timestamp.getDate());
      const month = fill(this.state.timestamp.getMonth() + 1);
      const year = fill(this.state.timestamp.getFullYear());

      const classes = classNames('clock', this.props.className);

      return <div className={classes}>
          <div className="clock__time" style={this.props.clockStyle}>
            <span className="time__hours">{hours}</span>
            <span className="time__point">:</span>
            <span className="time__minutes">{minutes}</span>
            <span className="time__point">:</span>
            <span className="time__seconds">{seconds}</span>
          </div>
          <div className="clock__date" style={this.props.dateStyle}>
            <strong>{date}.{month}.{year}</strong>
          </div>
        </div>;
    }

    componentWillUnmount() {
      clearInterval(this.reload);
    }
  }

  Clock.propTypes = {
    ClockStore: React.PropTypes.object.isRequired,
    clockStyle: React.PropTypes.object,
    dateStyle: React.PropTypes.object
  };

  Clock.defaultProps = {
    clockStyle : {fontSize : '15px'},
    dateStyle  : {fontSize : '14px'}
  };

  R.Clock = R.ngInjectProps(Clock, ['ClockStore']);
})();
