import React, { Fragment, useEffect, useReducer } from 'react';
import { useParams } from "@reach/router";

import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';
import { useAppContext } from '../../shared/app-context/app-context';

import Layout from '../../layout/layout';
import AppDate from '../../shared/date/date';
import TrackRow from './track-row/track-row';
import Button from '../../shared/button/button';

import { parseTrackDuration, formatDuration, DURATION_FORMAT } from '../../../plugins/time-helpers';

import './playlist-detail-view.css';

const PLAYLIST_DETAIL_QUERY = `
	query GetPlaylistDetail($playlistId: ID!) {
		getPlaylist(playlistId: $playlistId) {
			id
			creationDate
			name
			tracksCount
			tracks {
				id
				externalId
				title
				duration
			}
		}
	}
`;

function getPlaylistDuration(playlistTracks) {
	const seconds = playlistTracks.reduce((total, track) => {
		return total + parseTrackDuration(track.duration);
	}, 0);
	return formatDuration(seconds, DURATION_FORMAT.SHORT);
}

function playlistReducer(playlist, action) {
	switch (action.type) {
		case 'NEW_PLAYLIST':
			return action.payload.playlist;
		case 'TOGGLE_FAVORITE_TRACK':
			return {
				...playlist,
				tracks: playlist.tracks.map(_track => {
					if (_track.id === action.payload.track.id) {
						_track.isFavorite = !_track.isFavorite;
					}
					return _track;
				})
			}
		case 'DELETE_TRACK':
			return {
				...playlist,
				tracks: playlist.tracks.filter(_track => (_track.id !== action.payload.track.id))
			}; 
		default:
			return playlist;
	}
}

function PlaylistDetailView() {
	// const [playlist, setPlaylist] = useState
	const [playlist, dispatch] = useReducer(playlistReducer);
	const { player } = useAppContext();
	const { playlistId } = useParams();
	const { isFetching, data } = useDataFetching({
		query: PLAYLIST_DETAIL_QUERY,
		params: { playlistId }
	});
	
	useEffect(() => {
		if (data && data.getPlaylist) {
			dispatch({ type: 'NEW_PLAYLIST', payload: { playlist: data.getPlaylist }});
		}
	}, [data]);
	
	const onTrackFavoriteToggle = track => {
		// TODO send mutation to server
		dispatch({ type: 'TOGGLE_FAVORITE_TRACK', payload: { track }});
	};

	const onDeleteTrack = track => {
		dispatch({ type: 'DELETE_TRACK', payload: { track }});
	};

	return (
		<Layout>
			<div className="playlist-detail-view">
				{isFetching && <div>Loading playlist...</div>}
				{
					!!playlist &&
					<Fragment>
						<h1 className="playlist-detail-view__title">{playlist.name}</h1>
						<div className="playlist-detail-view__info">
							<span className="playlist-detail-view__info-data">Tracks count: {playlist.tracksCount}</span>
							<span className="playlist-detail-view__info-data">Duration: {getPlaylistDuration(playlist.tracks)}</span>
							<span className="playlist-detail-view__info-data">
								Creation date: <AppDate date={playlist.creationDate} />
							</span>
						</div>
						<div className="playlist-detail-view__actions">
							<Button 
								size="small"
								onClick={() => player.loadPlaylist(playlist)}
							>Play</Button>
							<Button kind="secondary" size="small">Delete</Button>
						</div>
						<ol className="playlist-detail-view__tracklist">
							{playlist.tracks.map(
								(track, index) => (
									<TrackRow 
										key={track.id}
										track={track} 
										index={index + 1} 
										onFavoriteToggle={onTrackFavoriteToggle}
										onDeleteTrack={onDeleteTrack}
									/>
								)
							)}
						</ol>
					</Fragment>
				}
			</div>
		</Layout>
	)
}

export default PlaylistDetailView;
