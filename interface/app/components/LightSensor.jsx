(function() {
  'use strict';

  const R = window.REACT = window.REACT || {};

  const LightSensorValue = React.createClass({ // eslint-disable-line no-unused-vars
    propTypes: {
      reading: React.PropTypes.number,
      measurement: React.PropTypes.string
    },

    render() {
      return <div className="light-sensor__value">
        {this.props.reading !== null ? `${this.props.reading} ${this.props.measurement}` : 'Нет данных'}
      </div>;
    }
  });

  const LightSensorBar = React.createClass({ // eslint-disable-line no-unused-vars
    propTypes: {
      sensor: React.PropTypes.object.isRequired
    },

    _calculateStyle(sensor) {
      const reading = sensor.current_reading;
      const ratio = reading / 255;

      if (reading === null ) {
        return {height: '5%', backgroundColor: 'darkgrey'};
      } else if (ratio < 0.05) {
        return {height: '5%', backgroundColor: 'rgb(0, 0, 12)'};
      } else if (ratio > 0.5) {
        return {height: `${100 * ratio}%`, backgroundColor: `rgb(${255}, ${Math.ceil(215 * ratio)}, 12)`}; // eslint-disable-line comma-spacing
      } else if (ratio <= 0.5) {
        return {height: `${100 * ratio}%`, backgroundColor: `rgb(${Math.ceil(255 * ratio * 2)}, 0, 12)`}; // eslint-disable-line comma-spacing
      }
    },

    render() {
      const style = this._calculateStyle(this.props.sensor);

      return <div className="light-sensor__bar">
        <div className="light-sensor__bar__value" style={style}></div>
      </div>;
    }
  });

  R.LightSensor = React.createClass({
    propTypes: {
      sensor: React.PropTypes.object.isRequired,
      openGraph: React.PropTypes.func.isRequired
    },

    handleClick() {
      this.props.openGraph(this.props.sensor);
    },

    render() {
      return <div className="light-sensor__container">
          <div className="light-sensor" onClick={this.handleClick}>
            <div className="light-sensor__info">
              <div className="light-sensor__name">{this.props.sensor.hr_name}</div>
              <LightSensorValue reading={this.props.sensor.current_reading} measurement={this.props.sensor.measurement} />
            </div>
            <LightSensorBar sensor={this.props.sensor} />
          </div>
        </div>;
    }
  });

  R.LightSensorList = React.createClass({
    mixins: [R.ngInjectMixin(React)],

    propTypes: {
      openGraph: React.PropTypes.func.isRequired
    },

    _getLightSensors() {
      return _(this.SensorsStore.getSensors())
        .filter((sensor) => sensor.tag.includes('.LS'))
        .value();
    },

    getInitialState() {
      this.SensorsStore = this.ngInject('SensorsStore');

      return {
        sensors : this._getLightSensors()
      };
    },

    handleChange() {
      this.setState({sensors: this._getLightSensors()});
    },

    componentDidMount() {
      this.SensorsStore.addChangeListener(this.handleChange);
    },

    componentWillUnmount() {
      this.SensorsStore.removeChangeListener(this.handleChange);
    },

    render() {
      const sensors = this.state.sensors
        .map((sensor) => <R.LightSensor sensor={sensor} openGraph={this.props.openGraph} key={sensor.id} />);

      return <div>{sensors}</div>;
    }
  });
})();
