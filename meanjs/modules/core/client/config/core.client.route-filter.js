(function () {
  'use strict';

  angular
    .module('core')
    .run(routeFilter);

  routeFilter.$inject = ['$rootScope', '$state'];

  function routeFilter($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess(fromState, fromParams) {
      // Record previous state
      storePreviousState(fromState, fromParams);
    }

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
    }
  }
}());
