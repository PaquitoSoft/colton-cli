import React from 'react';

import { parseTrackDuration, formatDuration } from '../../../plugins/time-helpers';

// import IconButton from '../../../shared/icon-button/icon-button';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as FavoriteNoIcon } from './favorite-no-icon.svg';
import { ReactComponent as FavoriteYesIcon } from './favorite-yes-icon.svg';
import { ReactComponent as TrackIsPlayingIcon } from './track-playing-icon.svg';

import './track-row.css';
import Player from '../../../services/player';

const noop = () => false;

function TrackRow({ 
	track, 
	playerTrack = {},
	playerStatus,
	index, 
	actions,
	onFavoriteToggle = noop, 
	onPlay = noop
}) {
	const FavoriteIcon = track.isFavorite ? FavoriteYesIcon : FavoriteNoIcon;
	const isPlayerTrack = track.externalId === playerTrack.externalId;
	const playerIsPlaying = playerStatus === Player.states.PLAYING;

	return (
		<li className={`track-row ${isPlayerTrack ? 'track-row--playing' : ''}`}>
			<div className="track-row__position">
				<span className="track-row__index">{index}.</span>
				{isPlayerTrack && playerIsPlaying && <TrackIsPlayingIcon className="track-row__playing-icon icon" />}
				{(!isPlayerTrack || !playerIsPlaying) && 
					<PlayIcon 
						className="track-row__play-icon icon" 
						onClick={() => onPlay(track)}
					/>
				}
				<FavoriteIcon 
					className="track-row__favorite-icon icon"
					onClick={() => {onFavoriteToggle(track)}}
				/>
			</div>
			<div className="track-row__title" title={track.title}>{track.title}</div>
			<div className="track-row__duration">{formatDuration(parseTrackDuration(track.duration))}</div>
			<div className="track-row__actions">{actions}</div>
		</li>
	);
}

export default TrackRow;
