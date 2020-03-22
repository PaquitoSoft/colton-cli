import React from 'react';

import IconButton from '../../../shared/icon-button/icon-button';
import { ReactComponent as PlayIcon } from './play-icon.svg';
import { ReactComponent as FavoriteNoIcon } from './favorite-no-icon.svg';
import { ReactComponent as FavoriteYesIcon } from './favorite-yes-icon.svg';
import { ReactComponent as TrackMenuIcon } from './add-icon.svg';

import './track-row.css';

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
			<div className="track-row__duration">{track.duration}</div>
			<div className="track-row__actions">
				<IconButton><TrackMenuIcon/></IconButton>
			</div>
		</li>
	);
}

export default TrackRow;
