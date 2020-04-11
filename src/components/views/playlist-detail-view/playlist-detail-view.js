import React, { Fragment, useEffect, useReducer } from 'react';
import { useParams, useNavigate } from "@reach/router";

import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';
import { useAppContext } from '../../shared/app-context/app-context';
import { usePlayerContext } from '../../shared/player-context/player-context';

import Layout from '../../layout/layout';
import AppDate from '../../shared/date/date';
import TrackRow from '../../shared/track-row/track-row';
import Button from '../../shared/button/button';
import IconButton from '../../shared/icon-button/icon-button';
import { ReactComponent as RemoveIcon } from './remove-from-playlist.svg';

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
				isFavorite
				isDisabled
			}
		}
	}
`;

const REMOVE_PLAYLIST_MUTATION = `
	mutation RemovePlaylist($playlistId: ID!) {
		removePlaylist(playlistId: $playlistId)
	}
`;

const TOGGLE_FAVORITE_TRACK_MUTATION = `
	mutation ToggleUserFavoriteTrack($track: FavoriteTrack!) {
		toggleUserFavoriteTrack(track: $track) {
			tracksCount
		}
	}
`;


const REMOVE_FROM_PLAYLIST_MUTATION = `
	mutation RemoveTrackFromPlaylist($playlistId: ID!, $trackId: ID!) {
		removeTrackFromPlaylist(playlistId: $playlistId, trackId: $trackId) {
			id
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
		case 'ADD_TRACK':
			return {
				...playlist,
				tracks: playlist.tracks.concat(action.payload.track)
			};
		case 'DELETE_TRACK':
			return {
				...playlist,
				tracks: playlist.tracks.filter(_track => (_track.id !== action.payload.track.id))
			};
		default:
			return playlist;
	}
}

function PlaylistTrackActions({ onClick }) {
	return (
		<IconButton>
			<RemoveIcon onClick={onClick} />
		</IconButton>
	)
}

function PlaylistDetailView() {
	const navigate = useNavigate();
	const [playlist, dispatch] = useReducer(playlistReducer);
	const { player } = usePlayerContext();
	const { apiClient } = useAppContext();
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
		dispatch({ type: 'TOGGLE_FAVORITE_TRACK', payload: { track }});

		apiClient.sendMutation({
			mutation: TOGGLE_FAVORITE_TRACK_MUTATION,
			variables: { track }
		})
		.catch(([error]) => {
			console.error(error);
			dispatch({ type: 'TOGGLE_FAVORITE_TRACK', payload: { track }});
		});
	};

	const onDeleteTrack = track => {
		dispatch({ type: 'DELETE_TRACK', payload: { track }});

		apiClient.sendMutation({
			mutation: REMOVE_FROM_PLAYLIST_MUTATION,
			variables: { playlistId: playlist.id, trackId: track.id }
		})
		.then(({ data }) => {
			console.log('Toggle favorite track success:', data);
		})
		.catch(([error]) => {
			console.error(error);
			dispatch({ type: 'ADD_TRACK', payload: { track }});
		});
	};

	const onDeletePlaylist = () => {
		apiClient.sendMutation({
			mutation: REMOVE_PLAYLIST_MUTATION,
			variables: { playlistId: playlist.id }
		})
		.then(() => {
			navigate('/playlists');
		})
		.catch(([error]) => {
			console.error(error);
		});
	}

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
							<Button 
								kind="secondary" 
								size="small"
								onClick={onDeletePlaylist}
							>Delete</Button>
						</div>
						<ol className="playlist-detail-view__tracklist">
							{playlist.tracks.map(
								(track, index) => (
									<TrackRow 
										key={track.id}
										track={track} 
										index={index + 1}
										playlist={playlist}
										onFavoriteToggle={onTrackFavoriteToggle}
										actions={<PlaylistTrackActions onClick={() => onDeleteTrack(track)} />}
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
