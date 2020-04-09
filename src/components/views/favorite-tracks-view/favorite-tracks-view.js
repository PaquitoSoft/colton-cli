import React, { useEffect, useState } from 'react';

import { useAppContext } from '../../shared/app-context/app-context';
import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';

import Layout from '../../layout/layout';
import TrackRow from '../../shared/track-row/track-row';

const FAVORITE_TRACKS_QUERY = `
	query GetUserFavoritesTracks {
		getUserFavoritesPlaylist {
			id
			name
			creationDate
			tracks {
				id
				externalId
				title
				duration
				length
				isFavorite
				thumbnailUrl
			}
		}
	}
`;

const TOGGLE_FAVORITE_TRACK_MUTATION = `
	mutation ToggleUserFavoriteTrack($track: FavoriteTrack!) {
		toggleUserFavoriteTrack(track: $track) {
			tracksCount
		}
	}
`;

// TODO Code duplicated with PlaylistDetailView
function FavoriteTracksView() {
	const { apiClient } = useAppContext();
	const [favoritesPlaylist, setFavoritesPlaylist] = useState();
	const { isFetching, data } = useDataFetching({
		query: FAVORITE_TRACKS_QUERY
	});
	
	useEffect(() => {
		if (data && data.getUserFavoritesPlaylist) {
			setFavoritesPlaylist(data.getUserFavoritesPlaylist);
		}
	}, [data]);

	const onTrackFavoriteToggle = track => {
		const trackIndex = favoritesPlaylist.tracks
			.findIndex(_track => _track.id === track.id);
		favoritesPlaylist.tracks.splice(trackIndex, 1);
		setFavoritesPlaylist({ ...favoritesPlaylist });

		apiClient.sendMutation({
			mutation: TOGGLE_FAVORITE_TRACK_MUTATION,
			variables: { track }
		})
		.catch(([error]) => {
			// TODO Handle error
			console.error(error);
			favoritesPlaylist.tracks.splice(trackIndex, 0, track);
			setFavoritesPlaylist({ ...favoritesPlaylist });
		});
	};

	if (!isFetching) {
		console.log(`Rendering ${favoritesPlaylist.tracks.length} tracks`);
	}

	return (
		<Layout>
			<div className="favorite-tracks-view">
				<h1 className="favorite-tracks-view__title">YOUR FAVORITE SONGS</h1>
				{isFetching && <div>Loading favorite songs...</div>}
				{!isFetching && !!favoritesPlaylist &&
					<ol className="playlist-detail-view__tracklist">
						{favoritesPlaylist.tracks.map(
							(track, index) => (
								<TrackRow 
									key={track.id}
									track={track} 
									index={index + 1}
									playlist={favoritesPlaylist}
									onFavoriteToggle={onTrackFavoriteToggle}
								/>
							)
						)}
					</ol>
				}
			</div>
		</Layout>
	);
}

export default FavoriteTracksView;
