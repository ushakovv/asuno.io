(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  class RemoteCommandList extends React.Component {
    constructor(props) {
      super(props);

      this.changeListener = this.changeListener.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.toggleShowFinished = this.toggleShowFinished.bind(this);

      const { rdp, Auth, RemoteCommandStore } = this.props;

      this.state = {
        limit        : 10,
        showFinished : false,
        isSupervisor : Auth.isSupervisor(),
        pendingCount : RemoteCommandStore.getPendingCount(),
        commands     : RemoteCommandStore.getCommands(false, rdp)
      };
    }

    componentWillReceiveProps(nextProps, nextState) {
      const { RemoteCommandStore } = this.props;

      this.setState({
        commands: RemoteCommandStore.getCommands(!!nextState.showFinished, nextProps.rdp)
      });
    }

    componentWillMount() {
      this.props.RemoteCommandStore.addChangeListener(this.changeListener);
    }

    changeListener() {
      const { RemoteCommandStore, rdp } = this.props;

      this.setState({
        commands     : RemoteCommandStore.getCommands(this.state.showFinished, rdp),
        pendingCount : RemoteCommandStore.getPendingCount()
      });
    }

    handleClose() {
      const { RemoteCommandStore, $close } = this.props;
      if (RemoteCommandStore.getPendingCount() === 0) {
        $close();
      } else {
        this.setState({commands : RemoteCommandStore.getCommands(this.state.showFinished, this.props.rdp)});
      }
    }

    toggleShowFinished(event) {
      this.setState({showFinished : event.target.checked});
    }

    render() {
      const commands = this.state.commands.map((command) => {
        return <R.RemoteCommand command={command} key={command.get('id')} />;
      });

      let footer;

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

    componentWillUnmount() {
      this.props.RemoteCommandStore.removeChangeListener(this.changeListener);
    }
  }

  R.RemoteCommandList = R.ngInjectProps(RemoteCommandList, ['Auth', 'RemoteCommandStore']);

})();
