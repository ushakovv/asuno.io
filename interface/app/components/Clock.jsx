(function () {
  'use strict';

  function fill(value) {
    return value < 10 ? '0' + value : value;
  }

  window.REACT = window.REACT || {};

  window.REACT.Clock = React.createClass({
    getTime              : function () {
      return {timestamp : this.props.store.getTime()};
    },
    getInitialState      : function () {
      return this.getTime();
    },
    getDefaultProps      : function () {
      return {
        clock_style : {fontSize : '15px'},
        date_style  : {fontSize : '14px'}
      };
    },
    componentWillMount   : function () {
      this.reload = setInterval(this.updateTs, 1000);
    },
    updateTs             : function () {
      this.setState(this.getTime());
    },
    render               : function () {
      var hours = fill(this.state.timestamp.getHours());
      var minutes = fill(this.state.timestamp.getMinutes());
      var seconds = fill(this.state.timestamp.getSeconds());
      var date = fill(this.state.timestamp.getDate());
      var month = fill(this.state.timestamp.getMonth() + 1);
      var year = fill(this.state.timestamp.getFullYear());

      var classes = classNames('clock clock--animated', this.props.className);

      return <div className={classes}>
          <div className="clock__time" style={this.props.clock_style}>
            <span className="time__hours">{hours}</span>
            <span className="time__point">:</span>
            <span className="time__minutes">{minutes}</span>
            <span className="time__point">:</span>
            <span className="time__seconds">{seconds}</span>
          </div>
          <div className="clock__date" style={this.props.date_style}>
            <strong>{date}.{month}.{year}</strong>
          </div>
        </div>;
    },
    componentWillUnmount : function () {
      clearInterval(this.reload);
    }
  });
})();
