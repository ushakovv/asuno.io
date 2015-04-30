(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  R.RemoteCommandList = React.createClass({
    mixins                    : [R.ngInjectMixin(React)],
    propTypes                 : {
      rdp    : React.PropTypes.number,
      $close : React.PropTypes.func
    },
    getDefaultProps           : function () {
      return {
        showFinished : false
      };
    },
    getInitialState           : function () {
      this.RemoteCommandStore = this.ngInject('RemoteCommandStore');

      return {
        limit        : 10,
        rdp          : this.props.rdp,
        showFinished : this.props.showFinished,
        isSupervisor : this.ngInject('Auth').isSupervisor(),
        pendingCount : this.RemoteCommandStore.getPendingCount(),
        commands     : this.RemoteCommandStore.getCommands(this.props.showFinished, this.props.rdp)
      };
    },
    componentWillReceiveProps : function (nextProps) {
      this.setState({
        rdp          : nextProps.rdp,
        showFinished : !!nextProps.showFinished,
        commands     : this.RemoteCommandStore.getCommands(!!nextProps.showFinished, nextProps.rdp)
      });
    },
    changeListener            : function () {
      this.setState({
        commands     : this.RemoteCommandStore.getCommands(this.state.showFinished, this.state.rdp),
        pendingCount : this.RemoteCommandStore.getPendingCount()
      });
    },
    componentWillMount        : function () {
      this.RemoteCommandStore.addChangeListener(this.changeListener);
    },
    componentWillUnmount      : function () {
      this.RemoteCommandStore.removeChangeListener(this.changeListener);
    },
    handleClose               : function () {
      if (this.RemoteCommandStore.getPendingCount() === 0) {
        this.props.$close();
      } else {
        this.setState({commands : this.RemoteCommandStore.getCommands(this.props.showFinished, this.props.rdp)});
      }
    },
    toggleShowFinished        : function (event) {
      this.setProps({showFinished : event.target.checked});
    },
    render                    : function () {
      var self = this;

      var commands = this.state.commands.map(function (command) {
        return <REACT.RemoteCommand command={command} key={command.get('id')} ngInjector={self.props.ngInjector} />;
      });

      var footer;

      if (this.state.isSupervisor) {
        footer = <div className="modal-footer">
            <button className="btn btn-sm btn-primary" onClick={this.props.$close}>Закрыть</button>
          </div>;
      } else {
        footer = <div className="modal-footer">
            <button className="btn btn-sm btn-primary" onClick={this.handleClose} disabled={this.state.pendingCount > 0}>
              {this.state.pendingCount > 0 ? 'Есть необработанные операции' : 'Закрыть'}
            </button>
          </div>;
      }

      return <div>
          <div className="modal-header">
            <h3>
              Запросы управления{' '}
              <small>
                <label>
                  <input id="show-finished" type="checkbox" style={{cursor : 'pointer'}} checked={this.state.showFinished} onChange={this.toggleShowFinished}/>
                  {' '}показывать завершенные
                </label>
              </small>
            </h3>
          </div>
          <div className="remote-commands">
            {this.state.commands.length === 0 ? <h4 className="text-center">Все запросы обработаны</h4> : null}
            {commands}
          </div>
          {footer}
        </div>;
    }
  });
})();
