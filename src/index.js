import { h, Component } from 'preact';
import { exec, pathRankSort } from './util';
import './historyPushEvent';

// const routers = [];

function route(url, replace=false) {
	if (typeof url!=='string' && url.url) {
		replace = url.replace;
		url = url.url;
	}
	if (history) {

		if (replace===true) {
			history.replaceState(null, null, url);
		}
		else {
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


const Link = ({ children, ...props }) => (
	<a {...props} onClick={ handleLinkClick }>{ children }</a>
);


class Router extends Component {
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
	componentDidMount(){
		this.lastActive = this.getActive(this.props);
	}

	componentDidUpdate(prevProps, prevState){
		this.lastActive = this.getActive(prevProps);
	}

	getActive({ children, onChange, url }) {
		let active = children.slice().sort(pathRankSort).filter( ({ attributes }) => {
			let path = attributes.path,
				matches = exec(url, path, attributes);
			if (matches) {
				attributes.url = url;
				attributes.matches = matches;
				// copy matches onto props
				for (let i in matches) {
					if (matches.hasOwnProperty(i)) {
						attributes[i] = matches[i];
					}
				}
				return true;
			}
		});
		return active[0] || null;
	}

	render(props) {
		const url = props.url;
		const active = this.getActive(props);
		const children = [active];
		if(this.lastActive){
			console.log(this.lastActive.nodeName.name);
			children.unshift(this.lastActive);
		}
		let previous = this.previousUrl;
		if (url!==previous) {
			this.previousUrl = url;
			if (typeof onChange==='function') {
				onChange({
					router: this,
					url,
					previous,
					active
				});
			}
		}
		return <div class={props.className}>{children}</div>;
	}
}


const Route = ({ component:RoutedComponent, url, matches }) => (
	<RoutedComponent {...{url, matches}} />
);


Router.route = route;
Router.Router = Router;
Router.Route = Route;
Router.Link = Link;

export default Router;
