(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('preact')) :
  typeof define === 'function' && define.amd ? define(['preact'], factory) :
  (global.preactRouter = factory(global.preact));
}(this, function (preact) { 'use strict';

  var babelHelpers = {};

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  babelHelpers._extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };
  var EMPTY = {};

  function exec(url, route) {
  	var opts = arguments.length <= 2 || arguments[2] === undefined ? EMPTY : arguments[2];

  	var reg = /(?:\?([^#]*))?(#.*)?$/,
  	    c = url.match(reg),
  	    matches = {},
  	    ret = undefined;
  	if (c && c[1]) {
  		var p = c[1].split('&');
  		for (var i = 0; i < p.length; i++) {
  			var r = p[i].split('=');
  			matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
  		}
  	}
  	url = segmentize(url.replace(reg, ''));
  	route = segmentize(route || '');
  	var max = Math.max(url.length, route.length);
  	for (var i = 0; i < max; i++) {
  		if (route[i] && route[i].charAt(0) === ':') {
  			matches[route[i].substring(1)] = decodeURIComponent(url[i] || '');
  		} else {
  			if (route[i] !== url[i]) {
  				ret = false;
  				break;
  			}
  		}
  	}
  	if (opts['default'] !== true && ret === false) return false;
  	return matches;
  }

  function pathRankSort(a, b) {
  	var aAttr = a.attributes || EMPTY,
  	    bAttr = b.attributes || EMPTY;
  	if (aAttr['default']) return 1;
  	if (bAttr['default']) return -1;
  	var diff = rank(aAttr.path) - rank(bAttr.path);
  	return diff || aAttr.path.length - bAttr.path.length;
  }

  function segmentize(url) {
  	return strip(url).split('/');
  }

  function rank(url) {
  	return (strip(url).match(/\/+/g) || '').length;
  }

  function strip(url) {
  	return url.replace(/(^\/+|\/+$)/g, '');
  }

  if (typeof window !== 'undefined') {
    (function (history) {
      var pushState = history.pushState;
      var replaceState = history.replaceState;

      history.pushState = function (state) {
        pushState.apply(history, arguments);

        if (typeof history.onpushstate == "function") {
          history.onpushstate({ state: state });
        }
        return pushState.apply(history, arguments);
      };
      history.replaceState = function (state) {
        if (typeof history.onreplacestate == "function") {
          history.onreplacestate({ state: state });
        }

        return replaceState.apply(history, arguments);
      };
    })(window.history);
  }

  // const routers = [];

  function route(url) {
  	var replace = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  	if (typeof url !== 'string' && url.url) {
  		replace = url.replace;
  		url = url.url;
  	}
  	if (history) {

  		if (replace === true) {
  			history.replaceState(null, null, url);
  		} else {
  			history.pushState(null, null, url);
  		}
  	}
  	// routeTo(url);
  }
  //
  // function routeTo(url) {
  // 	routers.forEach( router => router.routeTo(url) );
  // }

  // function getCurrentUrl(url) {
  // 	return typeof location!=='undefined' ?
  // 		`${location.pathname || ''}${location.search || ''}` :
  // 		url || '';
  // }
  //
  // if (typeof addEventListener==='function') {
  // 	addEventListener('popstate', () => routeTo(getCurrentUrl()));
  // }

  function handleLinkClick(e) {
  	route(this.getAttribute('href'));
  	if (e.stopImmediatePropagation) e.stopImmediatePropagation();
  	e.stopPropagation();
  	e.preventDefault();
  	return false;
  }

  var Link = function Link(_ref) {
  	var children = _ref.children;
  	var props = babelHelpers.objectWithoutProperties(_ref, ['children']);
  	return preact.h(
  		'a',
  		babelHelpers._extends({}, props, { onClick: handleLinkClick }),
  		children
  	);
  };

  var Router = (function (_Component) {
  	babelHelpers.inherits(Router, _Component);

  	function Router() {
  		babelHelpers.classCallCheck(this, Router);

  		_Component.apply(this, arguments);
  	}

  	// constructor(props) {
  	// 	super();
  	// 	// set initial url
  	// 	this.state.url = getCurrentUrl(props && props.url);
  	// }
  	//
  	// routeTo(url) {
  	// 	this.setState({ url });
  	// }
  	//
  	// componentWillMount() {
  	// 	routers.push(this);
  	// }
  	//
  	// componentWillUnmount() {
  	// 	routers.splice(routers.indexOf(this), 1);
  	// }

  	Router.prototype.componentDidMount = function componentDidMount() {
  		this.lastActive = this.getActive(this.props);
  	};

  	Router.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
  		this.lastActive = this.getActive(this.props);
  	};

  	Router.prototype.getActive = function getActive(_ref2) {
  		var children = _ref2.children;
  		var onChange = _ref2.onChange;
  		var url = _ref2.url;

  		var active = children.slice().sort(pathRankSort).filter(function (_ref3) {
  			var attributes = _ref3.attributes;

  			var path = attributes.path,
  			    matches = exec(url, path, attributes);
  			if (matches) {
  				attributes.url = url;
  				attributes.matches = matches;
  				// copy matches onto props
  				for (var i in matches) {
  					if (matches.hasOwnProperty(i)) {
  						attributes[i] = matches[i];
  					}
  				}
  				return true;
  			}
  		});
  		return active[0] || null;
  	};

  	Router.prototype.render = function render(props) {
  		var url = props.url;
  		var active = this.getActive(props);
  		var children = [active];
  		if (props.transition && this.lastActive) {
  			children.unshift(this.lastActive);
  		}
  		var previous = this.previousUrl;
  		if (url !== previous) {
  			this.previousUrl = url;
  			if (typeof onChange === 'function') {
  				onChange({
  					router: this,
  					url: url,
  					previous: previous,
  					active: active
  				});
  			}
  		}
  		return preact.h(
  			'div',
  			{ 'class': props['class'] },
  			children
  		);
  	};

  	return Router;
  })(preact.Component);

  var Route = function Route(_ref4) {
  	var RoutedComponent = _ref4.component;
  	var url = _ref4.url;
  	var matches = _ref4.matches;
  	return preact.h(RoutedComponent, { url: url, matches: matches });
  };

  Router.route = route;
  Router.Router = Router;
  Router.Route = Route;
  Router.Link = Link;

  return Router;

}));
//# sourceMappingURL=preact-router.js.map