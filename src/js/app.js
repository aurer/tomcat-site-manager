import React from 'react';
import ReactDom from 'react-dom';
import Settings from './components/Settings';
import App from './components/App';
import * as Store from './store';
import style from '../less/app.less';

// Try to exsure settings are filled in
var defaultView = "Vhosts";
const settings = Store.load('settings');
if (settings.domain.length < 1 || settings.root.length < 1) {
	defaultView = "Settings";
}

ReactDom.render(
	<App view={defaultView} />,
	document.querySelector('.App')
);
