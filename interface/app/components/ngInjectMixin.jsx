/**
 * Created by vasa on 17.08.14.
 */

(function () {
  'use strict';

  var R = window.REACT = window.REACT || {};

  R.ngInjectMixin = function (React) {
    return {
      propTypes: {
        ngInjector: React.PropTypes.object.isRequired
      },
      ngInject: function (name) {
        return this.props.ngInjector.get(name);
      }
    };
  };

  R.ngInjectProps = function (BaseComponent, injectables = []) {
    const ComponentWithInjector = class extends React.Component {
      getChildContext() {
        return {ngInjector: this.props.ngInjector};
      }

      render() {
        const ngInjector = this.props.ngInjector || this.context.ngInjector;

        const injected = injectables.reduce((acc, entity) => (acc[entity] = ngInjector.get(entity), acc), {});

        return <BaseComponent {...this.props} ngInjector={ngInjector} {...injected} />;
      }
    };

    ComponentWithInjector.displayName = (BaseComponent.displayName || BaseComponent.name || 'BaseInjectedComponent') + 'InjectWrapper';

    ComponentWithInjector.propTypes = {
      ngInjector: React.PropTypes.object
    };

    ComponentWithInjector.contextTypes = {
      ngInjector: React.PropTypes.object
    };

    ComponentWithInjector.childContextTypes = {
      ngInjector: React.PropTypes.object
    };

    return ComponentWithInjector;
  };
})();
