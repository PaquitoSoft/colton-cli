import React from 'react';

import { parseTrackDuration, formatDuration } from '../../../../plugins/time-helpers';

import IconButton from '../../../shared/icon-button/icon-button';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as FavoriteNoIcon } from './favorite-no-icon.svg';
import { ReactComponent as FavoriteYesIcon } from './favorite-yes-icon.svg';
import { ReactComponent as TrackPlayingIcon } from './track-playing-icon.svg';
import { ReactComponent as RemoveIcon } from './remove-from-playlist.svg';

import './track-row.css';

function TrackRow({ 
	track, 
	isPlayingTrack = false, 
	index, 
	onFavoriteToggle, 
	onPlay, 
	onDeleteTrack 
}) {
	const FavoriteIcon = track.isFavorite ? FavoriteYesIcon : FavoriteNoIcon;
	
	return (
		<li className={`track-row ${isPlayingTrack ? 'track-row--playing' : ''}`}>
			<div className="track-row__position">
				<span className="track-row__index">{index}.</span>
				{!!isPlayingTrack && <TrackPlayingIcon className="track-row__playing-icon icon" />}
				{!isPlayingTrack && 
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
			<div className="track-row__actions">
				<IconButton>
					<RemoveIcon onClick={() => onDeleteTrack(track)} />
				</IconButton>
			</div>
		</li>
	);
}

export default TrackRow;
