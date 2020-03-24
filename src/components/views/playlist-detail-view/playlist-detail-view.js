import React, { Fragment } from 'react';
import { useParams } from "@reach/router";

import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';

import Layout from '../../layout/layout';
import AppDate from '../../shared/date/date';
import TrackRow from './track-row/track-row';
import Button from '../../shared/button/button';

import { parseTrackDuration, formatDuration, DURATION_FORMAT } from '../../../plugins/time-helpers';

import './playlist-detail-view.css';
import { usePlaylistContext } from '../../shared/playlist-context/playlist-context';

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

function PlaylistDetailView() {
	const { loadNewPlaylist } = usePlaylistContext();
	const { playlistId } = useParams();
	const { isFetching, data } = useDataFetching({
		query: PLAYLIST_DETAIL_QUERY,
		params: { playlistId }
	});
	const playlist = data && data.getPlaylist;
	
	return (
		<Layout>
			<div className="playlist-detail-view">
				{isFetching && <div>Loading playlist...</div>}
				{
					!!data &&
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
								kind="secondary" 
								size="small"
								onClick={() => loadNewPlaylist(playlist)}
							>Play</Button>
							<Button kind="secondary" size="small">Delete</Button>
						</div>
						<ol className="playlist-detail-view__tracklist">
							{playlist.tracks.map(
								(track, index) => <TrackRow track={track} index={index + 1} key={track.id} />
							)}
						</ol>
					</Fragment>
				}
			</div>
		</Layout>
	)
}

export default PlaylistDetailView;
