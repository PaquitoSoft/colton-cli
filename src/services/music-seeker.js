import { getData } from '../plugins/ajax';

export function searchTrack(searchTerm, options = {}) {
	let searchUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&safeSearch=none&videoEmbeddable=true&key=AIzaSyAW3kFPPUol2hBcV_1ypYyzjPWJ4xKeCJU';

	const extraParams = new URLSearchParams({
		q: searchTerm,
		maxResults: options.resultsCount || 25,
		pageToken: options.resultsPage || ''
	});

	return getData(`${searchUrl}&${extraParams.toString()}`/*, { ttl: 60 }*/)
		.then(searchResult => {
			return {
				totalResults: searchResult.pageInfo.totalResults,
				prevPageToken: searchResult.prevPageToken,
				nextPageToken: searchResult.nextPageToken,
				tracks: searchResult.items.map(resultItem => ({
					externalId: resultItem.id.videoId,
					title: resultItem.snippet.title,
					duration: 0,
					thumbnailUrl: resultItem.snippet.thumbnails.default.url
				}))
			};
		});
}
