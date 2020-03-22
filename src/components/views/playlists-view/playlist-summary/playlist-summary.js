import React from 'react';

import Link from '../../../shared/link/link';

import './playlist-summary.css';

function PlaylistSummary({ playlist }) {
	return (
		<div className="playlist-summary">
			<Link to={`/playlist/${playlist.id}`} className="playlist-summary__content">
				<div className="playlist-summary__name">{playlist.name}</div>
			</Link>
		</div>
	)
}

export default PlaylistSummary;
