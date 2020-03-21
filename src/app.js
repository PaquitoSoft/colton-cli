import React from 'react';
import { Router, Redirect } from '@reach/router';

import { useAppContext } from './components/shared/app-context/app-context';

import AccessView from './components/views/access-view/access-view';
import PlaylistsView from './components/views/playlists-view/playlists-view';

import './app.css';

const NotFound = () => (<Redirect from="" to="/" noThrow />);

function Route({ path, component: Component, isPublic = false }) {
	const { currentUser } = useAppContext();
	
	if (!isPublic && !currentUser) {
		return (
			<Redirect from="" to="/login" noThrow />
		);
	} else {
		return (<Component path={path} />);
	}
}

function App() {
	return (
		<div className="app">
			<Router>
				<Redirect from="/" to="/home" noThrow />
				<Route path="/login" component={AccessView} isPublic={true} />
				<Route path="/home" component={PlaylistsView} />
				<NotFound default />
			</Router>
		</div>
	);
}

export default App;
