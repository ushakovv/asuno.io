(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  class CounterInput extends React.Component {
    constructor(props) {
      super(props);

      this.handleClick = this.handleClick.bind(this);
    }

    formatReading(reading) {
      if (typeof reading === 'number') {
        return reading.toFixed(2);
      } else {
        return 'Данных нет';
      }
    }

    formatTooltip(sensor) {
      if (new Date(sensor.last_reading_timestamp).getFullYear() !== 1970) {
        return `${sensor.hr_name} на ${moment(sensor.last_reading_timestamp).format('DD.MM.YYYY HH:mm:ss')}`;
      }
    }

    handleClick() {
      this.props.openGraph(this.props.sensor);
    }

    render() {
      const { sensor } = this.props;
      const tooltip = this.formatTooltip(sensor);
      const reading = this.formatReading(sensor.current_reading);

      const blockClasses = classNames(this.props.className, {
        'tooltipped tooltipped-n': tooltip
      });

      // TODO реализовано нормальный механизм проверки того, что сенсор аварийный, когда закончатся работы в asuno
      const inputClasses = classNames('form-control', 'telemetry-counter', {
        'telemetry-counter--alarm': sensor.is_alarm
      });

      const measurement = sensor.measurement ? <span className="input-group-addon">{sensor.measurement}</span> : null;

      return <div className={blockClasses} data-tooltip={tooltip}>
          <div className="form-group">
            <label className="control-label col-sm-3">{sensor.notation}</label>

            <div className="col-sm-8 input-group input-group-sm">
              <input type="text" className={inputClasses} value={reading} disabled />
              {measurement}
              <span className="input-group-btn">
                <button className="btn btn-default btn-sm" onClick={this.handleClick}>
                  <i className="fa fa-line-chart"></i>
                </button>
              </span>
            </div>
          </div>
        </div>;
    }
  }

  CounterInput.propTypes = {
    sensor: React.PropTypes.object,
    openGraph: React.PropTypes.func.isRequired
  };

  class CounterInputList extends React.Component {
    render() {
      const openGraph = this.props.openGraph;
      const sensors = this.props.sensors.map(function (sensor) {
        return <CounterInput className="col-sm-6" sensor={sensor} key={sensor.id} openGraph={openGraph}/>;
      });

      return <div className="row">
          {sensors}
        </div>;
    }
  }

  CounterInputList.propTypes = {
    sensors: React.PropTypes.array.isRequired,
    openGraph: React.PropTypes.func.isRequired
  };

  R.CounterInput = CounterInput;
  R.CounterInputList = CounterInputList;
})();
