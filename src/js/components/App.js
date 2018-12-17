import React from 'react';
import Vhosts from './Vhosts';
import Sites from './Sites';
import Settings from './Settings';
import Nav from './Nav';
import Notifications from './Notifications';
import { openTab } from '../helpers';
import { ExternalLink } from './Icons';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: this.props.view
		}
	}

	render() {
		const viewClass = "View View--" + this.state.view;
		return (
			<div className={viewClass}>
				<Nav onNavigate={this.loadView.bind(this)} default={this.state.view} />
				<main className="View-main">
					{this.state.view == "Vhosts" && <Vhosts />}
					{this.state.view == "Sites" && <Sites />}
					{this.state.view == "Settings" && <Settings />}
				</main>
				<Notifications />
				<nav className="Footer">
					<a onClick={this.openManager.bind(this)}>
						Open Host Manager
						<ExternalLink />
					</a>
				</nav>
			</div>
		)
	}

	loadView(props) {
		this.setState({ view: props.view});
	}

	openManager() {
		openTab('http://localhost:8080/host-manager/html/');
	}
}

export default App;
