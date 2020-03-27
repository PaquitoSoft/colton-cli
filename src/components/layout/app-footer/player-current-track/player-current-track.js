import React, { useState, useEffect } from 'react';

import Player from '../../../../services/player';
import { useAppContext } from '../../../shared/app-context/app-context';
import { formatDuration } from '../../../../plugins/time-helpers';

import { ReactComponent as AddToPlaylistIcon } from './add-to-playlist-icon.svg';
import { ReactComponent as SetFavoriteIcon } from './favorite-track-icon.svg';

import './player-current-track.css';

function PlayerCurrentTrack({ className = '' }) {
	const { player } = useAppContext();
	const [track, setTrack] = useState({});
	const [progress, setProgress] = useState({ elapsedTime: 0, elapsedPercent: 0});

	const onPlayerNewTrack = ({ newTrack }) => setTrack(newTrack);
	const onProgressBarClick = (event) => {
		const target = !!event.target.getAttribute('data-dynamic-bar') ?
			event.target.parentElement : event.target;
		const totalWidth = target.clientWidth;
		const seekPosition = Math.max(event.nativeEvent.offsetX, 0);

		player.seekTo(Math.ceil((seekPosition * 100) / totalWidth));
	}

	useEffect(() => {
		player.addEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack);
		player.addEventListener(Player.events.PROGRESS, setProgress);
		return () => {
			player.removeEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack)
			player.removeEventListener(Player.events.PROGRESS, setProgress);
		}
	}, [player]);

	return (
		<div className={`player-current-track ${className}`}>
			<div className="player-current-track__info">
				<div className="player-current-track__title">{track.title}</div>
				<div className="player-current-track__progress">
					<span className="player-current-track__time">{formatDuration(progress.elapsedTime)}</span>
					<div className="player-current-track__progress-bar" onClick={onProgressBarClick}>
						<span 
							className="player-current-track__progress-bar-indicator" 
							data-dynamic-bar="true"
							style={{ width: `${progress.elapsedPercent}%`}} 
						/>
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

