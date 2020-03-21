import React from 'react';

import './playlist-summary.css';

function PlaylistSummary({ playlist }) {
	return (
		<div className="playlist-summary">
			<div className="playlist-summary__content">
				<div className="playlist-summary__name">{playlist.name}</div>
			</div>
		</div>
	)
}

export default PlaylistSummary;
