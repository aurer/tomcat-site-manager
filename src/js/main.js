import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, browserHistory} from 'react-router';
import Popup from './components/Popup';
import Vhosts from './components/Vhosts';
import Sites from './components/Sites';
import Settings from './components/Settings';

ReactDom.render(
	<Router history={browserHistory}>
		<Route component={Popup}>
			<Route path="(*/)vhosts.html" component={Vhosts} />
			<Route path="(*/)settings.html" component={Settings} />
			<Route path="(*/)sites.html" component={Sites} />
		</Route>
	</Router>,
	document.querySelector('main')
);
