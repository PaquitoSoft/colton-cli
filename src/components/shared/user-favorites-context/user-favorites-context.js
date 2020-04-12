import React, { useContext, useState, useEffect } from 'react';

import { useAppContext } from '../app-context/app-context';

const UserFavoritesContext = React.createContext({
	favoritesPlaylist: null,
	invalidateFavorites: null,
	toggleFavoriteTrack: null
});

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
				isDisabled
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

export function UserFavoritesProvider({ children } ) {
	const { currentUser, apiClient } = useAppContext();
	const [favoritesPlaylist, setFavoritesPlaylist] = useState();	
	
	const invalidateFavorites = () => {
		apiClient.sendQuery({
			query: FAVORITE_TRACKS_QUERY
		})
		.then(({ data: { getUserFavoritesPlaylist } }) => {
			setFavoritesPlaylist(getUserFavoritesPlaylist);
		})
		.catch(console.error);
	};

	const toggleFavoriteTrack = track => {
		return new Promise((resolve, reject) => {
			const trackIndex = favoritesPlaylist.tracks
				.findIndex(_track => _track.externalId === track.externalId);
	
			if (trackIndex === -1) {
				favoritesPlaylist.tracks.push(track);
			} else {
				favoritesPlaylist.tracks.splice(trackIndex, 1);
			}
			setFavoritesPlaylist({ ...favoritesPlaylist });
	
			apiClient.sendMutation({
				mutation: TOGGLE_FAVORITE_TRACK_MUTATION,
				variables: { track }
			})
			.then(() => {
				resolve(favoritesPlaylist);
			})
			.catch(([error]) => {
				console.log(error);
				if (trackIndex === -1) {
					favoritesPlaylist.tracks.pop();
				} else {
					favoritesPlaylist.tracks.splice(trackIndex, 0, track);
				}
				setFavoritesPlaylist({ ...favoritesPlaylist });
				reject(error);
			});
		});
	};

	const providerInitialValue = {
		favoritesPlaylist,
		invalidateFavorites,
		toggleFavoriteTrack
	};

	useEffect(() => {
		invalidateFavorites();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser]);

	return (
		<UserFavoritesContext.Provider value={providerInitialValue}>
			{children}
		</UserFavoritesContext.Provider>
	);
}

export function useUserFavoritesTracksContext() {
	const context = useContext(UserFavoritesContext);
	if (!context) {
		throw new Error('useUserFavoritesTracksContext must be used within an UserFavoritesContext.Provider')
	}
	return context;
}
