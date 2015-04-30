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
})();
