(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  R.RemoteCommand = React.createClass({
    mixins                    : [R.ngInjectMixin(React)],
    propTypes                 : {
      command : React.PropTypes.object.isRequired
    },
    getInitialState           : function () {
      this.RemoteCommandActions = this.ngInject('RemoteCommandActions');

      this.COMMANDS = this.ngInject('COMMANDS');

      var $filter = this.ngInject('$filter');
      this.serverDateFilter = $filter('serverDate');
      this.dateFilter = $filter('date');

      return {
        isSupervisor : this.ngInject('Auth').isSupervisor(),
        command      : this.props.command
      };
    },
    componentWillReceiveProps : function (nextProps) {
      this.setState({command : nextProps.command});
    },
    toggleButtons             : function () {
      if (this.state.command.get('state') === 'waiting') {
        this.setState({showButtons : !this.state.showButtons});
      }
    },
    toggleCancel              : function () {
      this.setState({showCancelComment : !this.state.showCancelComment});
    },
    handleCancelComment       : function (event) {
      this.setState({cancelComment : event.target.value});
    },
    handleExecute             : function () {
      this.RemoteCommandActions.executeCommand(this.state.command.get('id'));
      this.setState({showButtons : false});
    },
    handleCancel              : function () {
      this.RemoteCommandActions.cancelCommand(this.state.command.get('id'));
      this.setState({showButtons : false});
    },
    handleReject              : function () {
      if (this.state.cancelComment) {
        this.RemoteCommandActions.rejectCommand(this.state.command.get('id'), this.state.cancelComment);
        this.setState({showButtons : false});
      }
    },
    shouldComponentUpdate     : function (nextProps, nextState) {
      return nextState.command !== this.state.command || nextState.cancelComment !== this.state.cancelComment
             || nextState.showButtons !== this.state.showButtons
             || nextState.showCancelComment !== this.state.showCancelComment;
    },
    render                    : function () {
      var command = this.state.command;

      var commandClass = classNames('remote-command', {
        'remote-command--finished' : command.get('state') !== 'waiting',
        'remote-command--executed' : command.get('state') === 'executed',
        'remote-command--rejected' : command.get('state') === 'rejected'
      });

      var commandTypeClass = classNames('remote-command__description__command__type', {
        'remote-command__description__command__type--safe'   : command.get('command') === 'mode:switch_off',
        'remote-command__description__command__type--danger' : command.get('command') !== 'mode:switch_off'
      });

      var message, commandDescription, buttons, comment;

      if (command.get('message')) {
        message = <div className="remote-command__description__object__comment">
          <strong>Комментарий: </strong>
          {command.get('message')}
        </div>;
      }

      if (command.get('command') === 'dimmer:set_level') {
        commandDescription = <span>{this.COMMANDS[command.get('command')]} на {command.getIn(['parameters', 0])} В</span>;
      } else {
        commandDescription = <span>{this.COMMANDS[command.get('command')]}</span>;
      }

      if (this.state.showCancelComment) {
        comment = <div className="input-button-group">
          <div className="input-button-group__button">
            <button className="btn btn-primary" disabled={!this.state.cancelComment} onClick={this.handleReject}>
              <i className="glyphicon glyphicon-ok"></i>
            </button>
            <button className="btn btn-primary" onClick={this.toggleCancel}>
              <i className="glyphicon glyphicon-remove"></i>
            </button>
          </div>
          <div className="input-button-group__wrapped">
            <input className="input-button-group__wrapped__input form-control" placeholder="Комментарий" type="text"
              value={this.state.value} onChange={this.handleCancelComment} required/>
          </div>
        </div>;
      }

      if (this.state.showButtons) {
        buttons = <div className="remote-command__operations">
          <div className="remote-command__operations__execute">
            {!this.state.isSupervisor ? <button className="btn btn-success btn-block" onClick={this.handleExecute}>Выполнить</button> : null}
          </div>
          <div className="remote-command__operations__reject">
            {!this.state.isSupervisor && !this.state.showCancelComment ? <button className="btn btn-default btn-block" onClick={this.toggleCancel}>Отказаться</button> : null}
            {this.state.isSupervisor ? <button className="btn btn-danger btn-block" onClick={this.handleCancel}>Отменить</button> : null}
            {comment}
          </div>
        </div>;
      }

      return <div className={commandClass}>
          <div className="remote-command__description" onClick={this.toggleButtons}>
            <div className="remote-command__description__object">
              <div className="remote-command__description__object__name">
                {command.get('pending') ? <i className="fa fa-spinner fa-spin"></i> : null}
                {command.getIn(['controller', 'name'])}
                {' '}
                <div className="remote-command__description__object__address">
                  {command.getIn(['controller', 'address'])}
                </div>
              </div>
              {message}
            </div>
            <div className="remote-command__description__command">
              <div className={commandTypeClass}>
                {commandDescription}
              </div>
              <div className="remote-command__description__command__timestamp">
                {this.dateFilter(this.serverDateFilter(command.get('timestamp')), 'dd.MM.yyyy HH:mm:ss')}
              </div>
            </div>
          </div>
          {this.state.showButtons ? buttons : null}
        </div>;
    }
  });
})();
