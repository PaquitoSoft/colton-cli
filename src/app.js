import React from 'react';
import { Router, Redirect } from '@reach/router';

import { useAppContext } from './components/shared/app-context/app-context';

import AccessView from './components/views/access-view/access-view';
import PlaylistsView from './components/views/playlists-view/playlists-view';
import PlaylistDetailView from './components/views/playlist-detail-view/playlist-detail-view';
import TrendingView from './components/views/trending-view/trending-view';
import FavoriteTracksView from './components/views/favorite-tracks-view/favorite-tracks-view';

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
				<Redirect from="/" to="/playlists" noThrow />
				<Route path="/login" component={AccessView} isPublic={true} />
				<Route path="/home" component={PlaylistsView} />
				<Route path="/playlists" component={PlaylistsView} />
				<Route path="/playlist/:playlistId" component={PlaylistDetailView} />
				<Route path="/favorites" component={FavoriteTracksView} />
				<Route path="/trending" component={TrendingView} />
				<NotFound default />
			</Router>
		</div>
	);
}

export default App;
