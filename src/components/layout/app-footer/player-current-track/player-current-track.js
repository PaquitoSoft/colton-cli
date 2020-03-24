import React, { useState, useEffect } from 'react';

import Player from '../../../../services/player';
import { useAppContext } from '../../../shared/app-context/app-context';

import { ReactComponent as AddToPlaylistIcon } from './add-to-playlist-icon.svg';
import { ReactComponent as SetFavoriteIcon } from './favorite-track-icon.svg';

import './player-current-track.css';

function PlayerCurrentTrack({ className = '' }) {
	const { player } = useAppContext();
	const [track, setTrack] = useState({});

	useEffect(() => {
		const onPlayerNewTrack = ({ newTrack }) => setTrack(newTrack);
		player.addEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack);
		return () => player.removeEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack)
	}, [player]);

	return (
		<div className={`player-current-track ${className}`}>
			<div className="player-current-track__info">
				<div className="player-current-track__title">{track.title}</div>
				<div className="player-current-track__progress">
					<span className="player-current-track__time">03:21</span>
					<div className="player-current-track__progress-bar">
						<span className="player-current-track__progress-bar-indicator" style={{ width: `${25}%`}}></span>
					</div>
				</div>
			</div>
			<div className="player-current-track__actions">
				<AddToPlaylistIcon className="icon" title="Add to playlist" />
				<SetFavoriteIcon className="icon" title="Set as favorite song" />
			</div>
		</div>
	);
}

export default PlayerCurrentTrack;

