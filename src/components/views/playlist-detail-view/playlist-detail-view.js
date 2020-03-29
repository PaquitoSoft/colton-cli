import React, { Fragment, useState, useEffect, useReducer } from 'react';
import { useParams } from "@reach/router";

import Player from '../../../services/player';
import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';
import { useAppContext } from '../../shared/app-context/app-context';

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
			}
		}
	}
`;

const TOGGLE_FAVORITE_TRACK_MUTATION = `
	mutation ToggleFavoriteTrack($track: FavoriteTrack!) {
		toggleFavoriteTrack(track: $track) {
			tracksCount
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

function PlaylistTrackActions({ onClick }) {
	return (
		<IconButton>
			<RemoveIcon onClick={onClick} />
		</IconButton>
	)
}

function PlaylistDetailView() {
	const [playlist, dispatch] = useReducer(playlistReducer);
	const [playingTrack, setPlayingTrack] = useState({});
	const { player, apiClient } = useAppContext();
	const { playlistId } = useParams();
	const { isFetching, data } = useDataFetching({
		query: PLAYLIST_DETAIL_QUERY,
		params: { playlistId }
	});
	const onPlayerNewTrack = ({ newTrack }) => setPlayingTrack(newTrack);

	
	useEffect(() => {
		if (data && data.getPlaylist) {
			dispatch({ type: 'NEW_PLAYLIST', payload: { playlist: data.getPlaylist }});
		}
		player.addEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack);
		return () => player.removeEventListener(Player.events.NEW_TRACK_PLAYING, onPlayerNewTrack)
	}, [data, player]);
	
	const onTrackFavoriteToggle = track => {
		dispatch({ type: 'TOGGLE_FAVORITE_TRACK', payload: { track }});

		apiClient.sendMutation({
			mutation: TOGGLE_FAVORITE_TRACK_MUTATION,
			variables: { track }
		})
		.then(({ data }) => {
			console.log('Toggle favorite track success:', data);
		})
		.catch(([error]) => {
			console.error(error);
			dispatch({ type: 'TOGGLE_FAVORITE_TRACK', payload: { track }});
		});
	};

	const onDeleteTrack = track => {
		// TODO send mutation to server
		dispatch({ type: 'DELETE_TRACK', payload: { track }});
	};

	const onPlayTrack = (track) => {
		player.loadPlaylist(playlist, playlist.tracks.findIndex(_track => _track.id === track.id));
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
										isPlayingTrack={playingTrack.id === track.id}
										index={index + 1}
										onPlay={onPlayTrack} 
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
