import React from 'react';

import { usePlaylistContext } from '../../shared/playlist-context/playlist-context';

import PlayerControls from './player-controls/player-controls';
import PlayerCurrentTrack from './player-current-track/player-current-track';

import './app-footer.css';

function AppFooter() {
	const { tracklist } = usePlaylistContext();

	console.log('AppFooter current Tracklist:', tracklist);

	return (
		<footer className="app-footer">
			<PlayerControls className="app-footer__player-controls" />
			<PlayerCurrentTrack className="app-footer__player-current-track" />
		</footer>
	);
}

export default AppFooter;
