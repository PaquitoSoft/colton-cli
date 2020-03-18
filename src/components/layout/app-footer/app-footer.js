import React from 'react';

import PlayerControls from './player-controls/player-controls';

import './app-footer.css';

function AppFooter() {
	return (
		<footer className="app-footer">
			<PlayerControls />
		</footer>
	);
}

export default AppFooter;
