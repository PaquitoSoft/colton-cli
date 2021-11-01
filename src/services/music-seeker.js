import { getData } from '../plugins/ajax';
import { getValue, storeValue } from '../plugins/local-cache';
import { formatDuration } from '../plugins/time-helpers';

const EXTERNAL_DURATION_REGEXP = /^PT(\d?\d+H)?(\d?\d+M)?(\d?\d+S)?$/;

function parseExternalDuration(externalDuration = '') {
	// PT1H17M46S
	// PT46M46S
	// PT5M1S
	// PT4M
	// eslint-disable-next-line no-unused-vars
	const [_, hours, minutes, seconds] = externalDuration.match(EXTERNAL_DURATION_REGEXP) || [];
	let result = 0;

	if (seconds) {
		result += parseInt(seconds.substring(0, seconds.length - 1), 10);
	}
	if (minutes) {
		result += (parseInt(minutes.substring(0, minutes.length - 1), 10) * 60);
	}
	if (hours) {
		result += (parseInt(hours.substring(0, hours.length - 1), 10) * 3600);
	}

	return result; // duration in seconds
}

function buildSearchResults(serverResponse) {
	return {
		totalResults: serverResponse.pageInfo.totalResults,
		prevPageToken: serverResponse.prevPageToken,
		nextPageToken: serverResponse.nextPageToken,
		tracks: serverResponse.items.map(resultItem => ({
			externalId: resultItem.id.videoId,
			title: resultItem.snippet.title,
			duration: 0,
			thumbnailUrl: resultItem.snippet.thumbnails.default.url
		}))
	};
}

function fetchVideosContentDetails(searchResults) {
	let url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key=AIzaSyCAOKAQUMrx8fNn9YqWq5wsvtHalQM3PdA';
	const videosIds = searchResults.tracks.map(track => track.externalId).join(',')
	return getData(`${url}&id=${videosIds}`)
		.then(data => ({
			searchResults,
			videosContentDetailsMap: data.items.reduce((map, itemResult) => {
				map[itemResult.id] = itemResult.contentDetails;
				return map;
			}, {})
		}));
}

function populateSearchResultsWithContentDetais({ searchResults, videosContentDetailsMap }) {
	searchResults.tracks.forEach(track => {
		const videoDetails = videosContentDetailsMap[track.externalId];
		if (videoDetails) {
			track.length = parseExternalDuration(videoDetails.duration);
			track.duration = formatDuration(track.length);
		} else {
			console.warn('No video details found for ', track.title);
		}
	});
	return searchResults;
}

function cacheSearchResult(cacheKey, ttl) {
	return (searchResults) => {
		storeValue(cacheKey, searchResults, ttl);
		return searchResults;
	}
}

export function searchTrack(searchTerm, options = {}) {
	let searchUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&safeSearch=none&videoEmbeddable=true&key=AIzaSyCAOKAQUMrx8fNn9YqWq5wsvtHalQM3PdA';

	const extraParams = new URLSearchParams({
		q: searchTerm,
		order: 'viewCount', // relevance (default), date, rating, title, viewCount
		maxResults: options.resultsCount || 25,
		pageToken: options.resultsPage || ''
	}).toString();
	
	const cacheKey = `search-${btoa(searchTerm + '_' + extraParams)}`;

	const result = getValue(cacheKey);

	if (result) return Promise.resolve(result);

	return getData(`${searchUrl}&${extraParams}`)
		.then(buildSearchResults)
		.then(fetchVideosContentDetails)
		.then(populateSearchResultsWithContentDetais)
		.then(cacheSearchResult(cacheKey, 60));
}
