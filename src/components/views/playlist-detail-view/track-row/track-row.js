import React from 'react';

import IconButton from '../../../shared/icon-button/icon-button';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as FavoriteNoIcon } from './favorite-no-icon.svg';
import { ReactComponent as FavoriteYesIcon } from './favorite-yes-icon.svg';
import { ReactComponent as TrackMenuIcon } from './add-icon.svg';

import './track-row.css';

const DURATION_REGEXP = /\(?(\d{2}):(\d{2})/;

function getDuration(trackDuration) {
	console.log(trackDuration, typeof trackDuration);
	let seconds = parseInt(trackDuration, 10);
	if (!seconds) {
		const[_, _minutes, _seconds] = trackDuration.match(DURATION_REGEXP);
		seconds = (parseInt(_minutes, 10) * 60) + parseInt(_seconds, 10);
	}
	const minutes = `${Math.floor(seconds / 60)}`.padStart(2, '0');
  	const _seconds = `${seconds % 60}`.padStart(2, '0');
  	return `${minutes}:${_seconds}`;
}

function TrackRow({ track, index }) {
	const FavoriteIcon = track.isFavorite ? FavoriteYesIcon : FavoriteNoIcon;
	return (
		<li className="track-row">
			<div className="track-row__position">
				<span className="track-row__index">{index}.</span>
				<PlayIcon className="track-row__play-icon icon" />
				<FavoriteIcon className="track-row__favorite-icon icon" />
			</div>
			<div className="track-row__title" title={track.title}>{track.title}</div>
			<div className="track-row__duration">{getDuration(track.duration)}</div>
			<div className="track-row__actions">
				<IconButton><TrackMenuIcon/></IconButton>
			</div>
		</li>
	);
}

export default TrackRow;
