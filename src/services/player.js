/* global YT */
// -1 = Unstarted -- 0 = Ended -- 1 = Playing -- 2 = Paused -- 3 Buffering -- 5 = Video cued
export const PLAYER_STATES = {
	STOPPED: 0,
	PLAYING: 1,
	PAUSED: 2,
	LOADING: 3,
	BUFFERING: 5,
};

class Player {

	#engine;
	#tracklist = [];
	#currentTrack;
	#status = PLAYER_STATES.STOPPED;
	#onStatusChange

	constructor({ engine, onStatusChange, tracklist = [] }) {
		this.#engine = engine;
		this.#tracklist = tracklist;
		this.#currentTrack = null;
		this.#onStatusChange = onStatusChange;
		
		this.#engine.addEventListener('onStateChange', this.onEngineStateChanged.bind(this));
		this.#engine.addEventListener('onError', this.onEngineError.bind(this));

		// Engine properties
		// "playerInfo", "cueVideoById", "loadVideoById", "cueVideoByUrl", "loadVideoByUrl", "playVideo", "pauseVideo", 
		// "stopVideo", "clearVideo", "getVideoBytesLoaded", "getVideoBytesTotal", "getVideoLoadedFraction", 
		// "getVideoStartBytes", "cuePlaylist", "loadPlaylist", "nextVideo", "previousVideo", "playVideoAt", "setShuffle", 
		// "setLoop", "getPlaylist", "getPlaylistIndex", "getPlaylistId", "loadModule", "unloadModule", "setOption", 
		// "mute", "unMute", "isMuted", "setVolume", "getVolume", "seekTo", "getPlayerState", "getPlaybackRate", 
		// "setPlaybackRate", "getAvailablePlaybackRates", "getPlaybackQuality", "setPlaybackQuality", 
		// "getAvailableQualityLevels", "getCurrentTime", "getDuration", "removeEventListener", "getDebugText", 
		// "getVideoData", "addCueRange", "removeCueRange", "getApiInterface", "showVideoInfo", "hideVideoInfo", 
		// "isVideoInfoVisible", "getSphericalProperties", "setSphericalProperties", "getVideoUrl", "getMediaReferenceTime"
	}

	onEngineStateChanged(event) {
		// -1 = Unstarted -- 0 = Ended -- 1 = Playing -- 2 = Paused -- 3 Buffering -- 5 = Video cued
		// When the player is first loaded it sends a -1 message
		// When the video is ready to play it sends a 5 message (<-- I don't see this behaviour)
		// console.info("Player::vPlayerStateChangeHandler# vPlayer changed its status: " + state);
		this.#status = Math.max(event.data, 0);
		this.#onStatusChange(this.#status);
		if (YT.PlayerState.ENDED === event.data) {
			console.info("Player::onEngineStateChanged# Publicando evento de cancion finalizada.");
			// events.trigger('trackPlaybackEnd', currentTrack);
		}
	}

	onEngineError(event) {
		/*
			2 -> The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
			5 -> The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.
			100 -> The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
			101 -> The owner of the requested video does not allow it to be played in embedded players.
			150 -> This error is the same as 101. It's just a 101 error in disguise!
		*/
		console.error("Player::onEngineError# Player raised an error code: " + event.data);
	}

	_loadAndPlay(track) {
		this.#engine.unMute();
		this.#engine.loadVideoById({ videoId: track.externalId });
	}

	play(track) {
		if (track) {
			this.#currentTrack = track;
			this._loadAndPlay(track);
			return true;
		}

		if (this.#currentTrack) {
			switch (this.#status) {
				case PLAYER_STATES.STOPPED:
					this._loadAndPlay(this.#currentTrack);
					break;
				default:
					this.#engine.playVideo();
			}
		}
	}
	pause() {
		this.#engine.pauseVideo();
	}
	stop() {}
	previous() {}
	next() {}

	seek() {}

	loadTracklist(tracklist = []) {
		this.#tracklist = tracklist;
	}

	addTrack(track) {
		this.#tracklist.push(track);
	}
	
	removeTrack(trackId) {
		this.#tracklist = this.tracklist.filter(track => track.id !== trackId);
	}

}

export default Player;
