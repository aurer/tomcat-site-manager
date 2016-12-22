import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Redirect, browserHistory} from 'react-router';
import Popup from './components/Popup';
import Vhosts from './components/Vhosts';
import Sites from './components/Sites';
import Settings from './components/Settings';
import * as Store from './store';

// Try to exsure settings are filled in
function requireSettings(nextState, replaceState) {
	let settings = Store.load('settings');
	if (settings.domain.length < 1 || settings.root.length < 1) {
		if (nextState.location.pathname != 'settings.html') {
			replaceState('settings.html', {thing: 'this'});
		}
	}
}

ReactDom.render(
	<Router history={browserHistory}>
		<Redirect from="/" to="index.html" />
		<Route component={Popup} onEnter={requireSettings}>
			<Route path="(*/)index.html" component={Vhosts} />
			<Route path="(*/)sites.html" component={Sites} />
			<Route path="(*/)settings.html" component={Settings} />
		</Route>
	</Router>,
	document.querySelector('.App')
);
