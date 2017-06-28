import React from 'React';
import Vhosts from './Vhosts';
import Sites from './Sites';
import Settings from './Settings';
import Nav from './Nav';
import Notifications from './Notifications';
import { openTab } from '../helpers';

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
				{this.state.view == "Vhosts" && <Vhosts />}
				{this.state.view == "Sites" && <Sites />}
				{this.state.view == "Settings" && <Settings />}
				<Notifications />
				<nav className="Nav Nav--base">
					<a className="Nav-item" onClick={this.openManager.bind(this)}>Open Host Manager</a>
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
