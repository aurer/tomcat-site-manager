import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, browserHistory} from 'react-router';
import Vhosts from './components/Vhosts';
import Options from './components/Options';
import { Settings, Sites } from './store';

ReactDom.render(
	<Router history={browserHistory}>
		<Route path="vhosts.html" component={Vhosts} />
		<Route path="options.html" component={Options} />
	</Router>,
	document.querySelector('main')
);
