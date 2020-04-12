import React, { useState, useEffect } from 'react';
import { useParams } from '@reach/router';

import useDataFetching from '../../shared/use-data-fetching/use-data-fetching';
import { useUserFavoritesTracksContext } from '../../shared/user-favorites-context/user-favorites-context';
import { searchTrack } from '../../../services/music-seeker';

import Layout from '../../layout/layout';
import TrackRow from '../../shared/track-row/track-row';
import IconButton from '../../shared/icon-button/icon-button';
import { ReactComponent as AddToPlaylistIcon } from './add-to-playlist-icon.svg'; 
import AddToPlaylistModal from '../../shared/add-to-playlist-modal/add-to-playlist-modal';

import './search-results-view.css';

const PLAYLISTS_QUERY = `
	query GetUserPlaylists {
		getPlaylistsByUser {
			id
			name
		}
	}
`;

function SearchResultItemActions({ onClick }) {
	return (
		<IconButton>
			<AddToPlaylistIcon onClick={onClick} />
		</IconButton>
	)
}

function toggleFavoriteSearchResult(searchResults, track) {
	const updatedTracks = searchResults.tracks.map(searchResult => {
		if (searchResult.externalId === track.externalId) {
			searchResult.isFavorite = !searchResult.isFavorite;
		}
		return searchResult;
	});
	return {
		...searchResults,
		tracks: updatedTracks
	};
}

// TODO Set favorite attribute to search results
function SearchResultsView() {
	const { searchTerm } = useParams();
	const { toggleFavoriteTrack } = useUserFavoritesTracksContext();
	const [searchResults, setSearchResults] = useState({ isSearching: true });
	const [addToPlaylistTrack, setAddToPlaylistTrack] = useState(null);
	const { data } = useDataFetching({ query: PLAYLISTS_QUERY });
	const playlists = (data && data.getPlaylistsByUser) || [];
	
	const showAddToPlaylistModal = (track) => {
		setAddToPlaylistTrack(track);
	};

	const hideAddToPlaylistModal = () => {
		setAddToPlaylistTrack(null);
	};

	useEffect(() => {
		setSearchResults(_searchResults => ({
			..._searchResults,
			isSearching: true
		}));

		searchTrack(searchTerm)
			.then(searchResult => {
				console.log('These are the search results:', searchResult);
				setSearchResults({
					...searchResult,
					isSearching: false
				});
			})
			.catch(error => { console.error('Error searching...', error)})
	}, [searchTerm]);

	const onTrackFavoriteToggle = track => {
		setSearchResults(toggleFavoriteSearchResult(searchResults, track));

		toggleFavoriteTrack(track)
			.catch(([error]) => {
				console.error(error);
				setSearchResults(toggleFavoriteSearchResult(searchResults, track));
			});
	};

	return (
		<Layout>
			<div className="search-results-view">
				{searchResults.isSearching && <div className="search-results-view__loading">Searching...</div>}
				{searchResults.totalResults === 0 && <div className="search-results-view__no-results">No results for your query</div>}
				{searchResults.totalResults > 0 &&
					<ol className="search-results-view__tracks">
						{searchResults.tracks.map(
							(track, index) => (
								<TrackRow 
									key={track.externalId}
									track={track} 
									index={index + 1}
									onFavoriteToggle={onTrackFavoriteToggle}
									actions={<SearchResultItemActions onClick={() => showAddToPlaylistModal(track)} />}
								/>
							)
						)}
					</ol>
				}

				{!!addToPlaylistTrack &&
					<AddToPlaylistModal 
						track={addToPlaylistTrack} 
						playlists={playlists}
						onExit={hideAddToPlaylistModal}
					/>
				}
			</div>
		</Layout>
	);
}

export default SearchResultsView;
