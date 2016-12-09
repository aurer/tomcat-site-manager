import React from 'react';
import { Link } from 'react-router';

var HTMLParser = require('fast-html-parser');

class Options extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<section className="Section Section--options">
				<h1>Tomcat Virtual Host Manager</h1>
				<div className="Tabs">
					<Link className="Tab" activeClassName="is-active" to="settings.html">Settings</Link>
					<Link className="Tab" activeClassName="is-active" to="sites.html">Sites</Link>
				</div>
				{this.props.children}
			</section>
		)
	}
}

export default Options;
