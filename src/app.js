import React from 'react';

import AccessView from './components/views/access-view/access-view';
import PlaylistsView from './components/views/playlists-view/playlists-view';

import './app.css';
import { useAppContext } from './components/shared/app-context/app-context';


function App() {
	const { currentUser } = useAppContext();

	return (
		<div className="app">
			{!!currentUser ? <PlaylistsView /> : <AccessView />}
		</div>
	);
}

export default App;
