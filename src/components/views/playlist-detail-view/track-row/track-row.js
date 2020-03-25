import React from 'react';

import IconButton from '../../../shared/icon-button/icon-button';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as FavoriteNoIcon } from './favorite-no-icon.svg';
import { ReactComponent as FavoriteYesIcon } from './favorite-yes-icon.svg';
// import { ReactComponent as TrackMenuIcon } from './add-icon.svg';
import { ReactComponent as RemoveIcon } from './remove-from-playlist.svg';

import './track-row.css';
import { parseTrackDuration, formatDuration } from '../../../../plugins/time-helpers';
import { useAppContext } from '../../../shared/app-context/app-context';

function TrackRow({ track, index, onFavoriteToggle, onDeleteTrack }) {
	const FavoriteIcon = track.isFavorite ? FavoriteYesIcon : FavoriteNoIcon;
	const { player } = useAppContext();

	return (
		<li className="track-row">
			<div className="track-row__position">
				<span className="track-row__index">{index}.</span>
				<PlayIcon 
					className="track-row__play-icon icon" 
					onClick={() => player.play(track)}
				/>
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
