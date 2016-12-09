import React from 'react';
import { Settings } from '../store';
import SettingsForm from './SettingsForm';
import SitesList from './SitesList';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

Tabs.setUseDefaultStyles(false);
var HTMLParser = require('fast-html-parser');

class Options extends React.Component {
	constructor(props) {
		super(props);
		// this.state = Settings.get();
	}

	onSelect(index, last) {

	}

	render() {
		return (
			<section className="Section Section--options">
				<h1>Tomcat Virtual Host Manager</h1>
				<Tabs selectedIndex={0} onSelect={this.onSelect}>
					<TabList>
						<Tab>Sites</Tab>
						<Tab>Settings</Tab>
					</TabList>
					<TabPanel>
						<SitesList />
					</TabPanel>
					<TabPanel>
						<SettingsForm />
					</TabPanel>
				</Tabs>
				{this.props.children}
			</section>
		)
	}
}

export default Options;
