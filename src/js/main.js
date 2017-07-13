import React from 'react';
import ReactDom from 'react-dom';
import Vhosts from './components/Vhosts';
import Sites from './components/Sites';
import Settings from './components/Settings';
import * as Store from './store';

import App from './components/App';
import style from '../less/app.less';

// Try to exsure settings are filled in
let defaultView = "Vhosts";
let settings = Store.load('settings');
if (settings.domain.length < 1 || settings.root.length < 1) {
	defaultView = "Settings";
}

ReactDom.render(
	<App view={defaultView} />,
	document.querySelector('.App')
);
