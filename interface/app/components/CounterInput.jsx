(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  R.CounterInput = React.createClass({
    propTypes: {
      sensor: React.PropTypes.object.isRequired,
      openGraph: React.PropTypes.func.isRequired
    },

    _formatReading(reading) {
      if (typeof reading === 'number') {
        return reading.toFixed(2);
      } else {
        return 'Данных нет';
      }
    },

    _formatTooltip(sensor) {
      if (new Date(sensor.last_reading_timestamp).getFullYear() !== 1970) {
        return `${sensor.hr_name} на ${moment(sensor.last_reading_timestamp).format('DD.MM.YYYY HH:mm:ss')}`;
      }
    },

    _handleClick() {
      this.props.openGraph(this.props.sensor);
    },

    render() {
      if (this.props.sensor) {
        const sensor = this.props.sensor;
        const tooltip = this._formatTooltip(sensor);
        const reading = this._formatReading(this.props.sensor.current_reading);

        const blockClasses = classNames(this.props.className, {
          'tooltipped tooltipped-n': tooltip
        });

        // TODO реализовано нормальный механизм проверки того, что сенсор аварийный, когда закончатся работы в asuno
        const inputClasses = classNames('form-control', 'telemetry-counter', {
          'telemetry-counter--alarm': this.props.sensor.is_alarm
        });

        const measurement = sensor.measurement ? <span className="input-group-addon">{sensor.measurement}</span> : null;

        return <div className={blockClasses} data-tooltip={tooltip}>
            <div className="form-group">
              <label className="control-label col-sm-3">{this.props.sensor.notation}</label>

              <div className="col-sm-8 input-group input-group-sm">
                <input type="text" className={inputClasses} value={reading} disabled />
                {measurement}
                <span className="input-group-btn">
                  <button className="btn btn-default btn-sm" onClick={this._handleClick}>
                    <i className="fa fa-line-chart"></i>
                  </button>
                </span>
              </div>
            </div>
          </div>;
      } else {
        return <div className="col-sm-6"></div>;
      }
    }
  });

  R.CounterInputList = React.createClass({
    render : function () {
      const openGraph = this.props.openGraph;
      const sensors = this.props.sensors.map(function (sensor) {
        return <R.CounterInput className="col-sm-6" sensor={sensor} key={sensor.id} openGraph={openGraph}/>;
      });

      return <div className="row">
          {sensors}
        </div>;
    }
  });
})();
