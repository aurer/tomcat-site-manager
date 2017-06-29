import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Redirect, browserHistory} from 'react-router';
import Vhosts from './components/Vhosts';
import Sites from './components/Sites';
import Settings from './components/Settings';
import * as Store from './store';

import App from './components/App';

// Try to exsure settings are filled in
let defaultView = "Vhosts";
let settings = Store.load('settings');
if (settings.domain.length < 1 || settings.root.length < 1) {
	defaultView = "Settings";
}

/*
ReactDom.render(
	<App view={defaultView} />,
	document.querySelector('.App')
);
*/