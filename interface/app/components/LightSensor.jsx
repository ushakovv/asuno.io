(function() {
  'use strict';

  const R = window.REACT = window.REACT || {};

  class LightSensorValue extends React.Component {
    render() {
      return <div className="light-sensor__value">
        {this.props.reading !== null ? `${this.props.reading} ${this.props.measurement}` : 'Нет данных'}
      </div>;
    }
  }

  LightSensorValue.propTypes = {
    reading: React.PropTypes.number,
    measurement: React.PropTypes.string
  };

  class LightSensorBar extends React.Component {
    calculateStyle(sensor) {
      const reading = sensor.current_reading;
      const ratio = reading / 255;

      if (reading === null ) {
        return {height: '5%', backgroundColor: 'darkgrey'};
      } else if (ratio < 0.05) {
        return {height: '5%', backgroundColor: 'rgb(0, 0, 12)'};
      } else if (ratio > 0.5) {
        return {height: `${100 * ratio}%`, backgroundColor: `rgb(${255}, ${Math.ceil(215 * ratio)}, 12)`}; //eslint-disable-line comma-spacing
      } else if (ratio <= 0.5) {
        return {height: `${100 * ratio}%`, backgroundColor: `rgb(${Math.ceil(255 * ratio * 2)}, 0, 12)`}; //eslint-disable-line comma-spacing
      }
    }

    render() {
      const style = this.calculateStyle(this.props.sensor);

      return <div className="light-sensor__bar">
        <div className="light-sensor__bar__value" style={style}></div>
      </div>;
    }
  }

  LightSensorBar.propTypes = {
    sensor: React.PropTypes.object.isRequired
  };

  class LightSensor extends React.Component {
    constructor(props) {
      super(props);

      this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
      this.props.openGraph(this.props.sensor);
    }

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
  }

  LightSensor.propTypes = {
    sensor: React.PropTypes.object.isRequired,
    openGraph: React.PropTypes.func.isRequired
  };

  class LightSensorList extends React.Component {
    constructor(props) {
      super(props);

      this.getLightSensors = this.getLightSensors.bind(this);
      this.handleChange = this.handleChange.bind(this);

      this.state = {
        sensors : this.getLightSensors()
      };
    }

    componentDidMount() {
      this.props.SensorsStore.addChangeListener(this.handleChange);
    }

    getLightSensors() {
      return _(this.props.SensorsStore.getSensors())
        .filter((sensor) => sensor.tag.includes('.LS'))
        .value();
    }

    handleChange() {
      this.setState({sensors: this.getLightSensors()});
    }

    render() {
      const sensors = this.state.sensors
        .map((sensor) => <LightSensor sensor={sensor} openGraph={this.props.openGraph} key={sensor.id} />);

      return <div>{sensors}</div>;
    }

    componentWillUnmount() {
      this.props.SensorsStore.removeChangeListener(this.handleChange);
    }
  }

  LightSensorList.propTypes = {
    openGraph: React.PropTypes.func.isRequired,
    SensorsStore: React.PropTypes.object.isRequired
  };

  R.LightSensorList = R.ngInjectProps(LightSensorList, ['SensorsStore']);
})();
