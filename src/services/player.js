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

	static events = {
		PLAYER_READY: 'ready',
		STATUS_CHANGED: 'new_status',
		TRACK_ENDED: 'track_end',
		NEW_TRACK_PLAYING: 'new_track_playing'
	};

	static states = {
		DISABLED: -1,
		STOPPED: 0,
		PLAYING: 1,
		PAUSED: 2,
		LOADING: 3,
		BUFFERING: 5,
	}

	#engine;
	#playlist = { tracks: [] };
	#currentTrackIndex = 0;
	#status = Player.states.DISABLED;
	#eventsListeners = {};

	constructor({ playlist }) {
		if (playlist) this.#playlist = playlist;
		
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

	
	get currentTrack() {
		return this.#playlist.tracks[this.#currentTrackIndex];
	}

	_fireEvent(eventType, eventData) {
		console.log('Player::_fireEvent# Firing event', eventType, 'with data:', eventData);
		(this.#eventsListeners[eventType] || []).forEach(listener => listener(eventData));
	}

	_onEngineStateChanged(event) {
		// -1 = Unstarted -- 0 = Ended -- 1 = Playing -- 2 = Paused -- 3 Buffering -- 5 = Video cued
		// When the player is first loaded it sends a -1 message
		// When the video is ready to play it sends a 5 message (<-- I don't see this behaviour)
		this.#status = Math.max(event.data, 0);
		this._fireEvent(Player.events.STATUS_CHANGED, { newStatus: this.#status });

		if (YT.PlayerState.ENDED === event.data) {
			console.warn('Player::_onEngineStateChanged# TODO Play next playlist track when the current one finishes');
		}
	}

	_onEngineError(event) {
		/*
			2 -> The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.
			5 -> The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.
			100 -> The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.
			101 -> The owner of the requested video does not allow it to be played in embedded players.
			150 -> This error is the same as 101. It's just a 101 error in disguise!
		*/
		console.error("Player::_onEngineError# Player raised an error code: " + event.data);
		switch (event.data) {
			case 101:
			case 150:
				// TODO update track server side to mark it as disabled
				this.next();
				break;
		
			default:
				break;
		}
	}

	_loadAndPlay(track) {
		this.#engine.unMute();
		this.#engine.loadVideoById({ videoId: track.externalId });
		this._fireEvent(Player.events.NEW_TRACK_PLAYING, { newTrack: track });
	}

	loadEngine(engine) {
		this.#engine = engine;
		this.#status = Player.states.STOPPED;
		
		this.#engine.addEventListener('onStateChange', this._onEngineStateChanged.bind(this));
		this.#engine.addEventListener('onError', this._onEngineError.bind(this));
	}

	/* ------------- PLAYER CONTROLS -------------- */
	play(track) {
		if (track) {
			this.#playlist = { tracks: [track] };
			this.#currentTrackIndex = 0;
			this._loadAndPlay(track);
			return true;
		}

		if (this.#playlist.tracks.length > 0) {
			switch (this.#status) {
				case PLAYER_STATES.STOPPED:
					this._loadAndPlay(this.currentTrack);
					break;
				default:
					this.#engine.playVideo();
			}
		}
	}

	pause() {
		this.#engine.pauseVideo();
	}

	stop() {
		this.#engine.stopVideo();
	}

	previous() {
		this.#currentTrackIndex = Math.max(this.#currentTrackIndex - 1, 0);
		this._loadAndPlay(this.currentTrack);
	}

	next() {
		let newIndex = this.#currentTrackIndex + 1;
		if (newIndex >= this.#playlist.tracks.length) {
			newIndex = 0;
		}

		this.#currentTrackIndex = newIndex;
		this._loadAndPlay(this.currentTrack);
	}

	seek() {}

	getStatus() {
		return this.#status;
	}

	/* ------------- TRACKLIST -------------- */
	loadPlaylist(playlist) {
		if (playlist) {
			this.#playlist = playlist;
			this.#currentTrackIndex = 0;
			this._loadAndPlay(this.currentTrack);
		}
	}

	addTrack(track) {
		this.#playlist.tracks.push(track);
	}
	
	removeTrack(trackId) {
		this.#playlist.tracks = this.#playlist.tracks.filter(track => track.id !== trackId);
	}


	/* ------------- EVENTS LISTENERS -------------- */
	addEventListener(eventType, eventListener) {
		this.#eventsListeners[eventType] = this.#eventsListeners[eventType] || [];
		this.#eventsListeners[eventType].push(eventListener);
	}

	removeEventListener(eventType, eventListener) {
		this.#eventsListeners[eventType] = (this.#eventsListeners[eventType] || [])
			.filter(listener => listener !== eventListener);
	}
}

export default Player;
