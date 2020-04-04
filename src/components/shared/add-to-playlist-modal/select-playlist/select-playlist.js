import React from 'react';

import Button from '../../button/button';

import './select-playlist.css';

function SelectPlaylist({ playlists, onNewPlaylistRequested, onPlaylistSelected }) {
	return (
		<div className="select-playlist">
			<Button 
				className="select-playlist__new-playlist"
				size="small"
				kind="primary"
				onClick={onNewPlaylistRequested}
			>New Playlist</Button>
			{!playlists.length && <div>Loading playlists...</div>}
			{!!playlists.length &&
				<ol className="select-playlist__list">
					{playlists.map(playlist => (
						<li 
							key={playlist.id}
							className="select-playlist__playlist"
							onClick={() => onPlaylistSelected(playlist)}
						>{playlist.name}</li>
					))}
				</ol>
			}
		</div>
	);
}

export default SelectPlaylist;
