if (typeof window !== 'undefined') {
  (function(history){
    let pushState = history.pushState;
    let replaceState = history.replaceState;

    history.pushState = function(state) {
      pushState.apply(history, arguments);

      if (typeof history.onpushstate == "function") {
        history.onpushstate({state: state});
      }
      return pushState.apply(history, arguments);
    };
    history.replaceState = function(state) {
      if (typeof history.onreplacestate == "function") {
        history.onreplacestate({state: state});
      }

      return replaceState.apply(history, arguments);
    };
  })(window.history);
}
