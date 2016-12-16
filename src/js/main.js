import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, browserHistory} from 'react-router';
import Vhosts from './components/Vhosts';
import Options from './components/Options';
import Sites from './components/Sites';
import Settings from './components/Settings';

ReactDom.render(
	<Router history={browserHistory}>
		<Route path="(*/)vhosts.html" component={Vhosts} />
		<Route component={Options}>
			<Route path="(*/)settings.html" component={Settings} />
			<Route path="(*/)sites.html" component={Sites} />
		</Route>
	</Router>,
	document.querySelector('main')
);
