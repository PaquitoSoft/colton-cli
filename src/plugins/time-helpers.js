const DURATION_REGEXP = /\(?(\d{2}):(\d{2})/;

export const DURATION_FORMAT = {
	COMPRESSED: 1,
	SHORT: 2
}

export function parseTrackDuration(trackDuration) {
	let seconds = parseInt(trackDuration, 10);
	if (!seconds) {
		// eslint-disable-next-line no-unused-vars
		const[_, _minutes, _seconds] = trackDuration.match(DURATION_REGEXP);
		seconds = (parseInt(_minutes, 10) * 60) + parseInt(_seconds, 10);
	}
	return seconds;
}

export function formatDuration(seconds, format = DURATION_FORMAT.COMPRESSED) {
	const minutes = `${Math.floor(seconds / 60)}`.padStart(2, '0');
	const _seconds = `${seconds % 60}`.padStart(2, '0');
	if (format === DURATION_FORMAT.COMPRESSED) {
		return `${minutes}:${_seconds}`;
	} else {
		return `${minutes} h. ${_seconds} min.`;
	}
}
