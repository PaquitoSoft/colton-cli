import { useAppContext } from "../app-context/app-context";

const TOGGLE_FAVORITE_TRACK_MUTATION = `
	mutation ToggleUserFavoriteTrack($track: FavoriteTrack!) {
		toggleUserFavoriteTrack(track: $track) {
			tracksCount
		}
	}
`;

export default function useToggleFavoriteTrack() {
	const { apiClient } = useAppContext();
	
	return {
		toggleFavoriteTrack: (track) => (
			apiClient.sendMutation({
				mutation: TOGGLE_FAVORITE_TRACK_MUTATION,
				variables: { track }
			})
		)
	}
};
